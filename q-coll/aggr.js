var expr=require("./expr");
var sync=require("./sync");
var DB=require("mongodb").Db
global.__mongodb__views__={}
global.__mongodb__views_has_created__={}
function aggr(db,name,schema){
    this.db=db;
    this.name=name;
    this.schema=schema;
    this.__pipe=[];
}
function parseToObject(obj,params){
    var ret={};
    var keys=Object.keys(obj);
    for (var i = 0; i < keys.length;i++){
        var key=keys[i];
        var val = obj[key];
        if(val===1 || val==0){
            ret[key]=val;
        }
        else if (val instanceof Object){
            ret[key]=parseToObject(val,params);
        }
        else if (typeof val==="string") {
            var _expr=expr.selector(val,params);
            ret[key] = _expr;
        }
        
    }
    return ret;
}
/**
 * Project
 */
aggr.prototype.project=function(){
    
    var fields;
    var  params=[];
    fields=arguments[0];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }

    var _project={};
    var _keys = Object.keys(fields);
    for (var i = 0; i < _keys.length;i++){
        _key = _keys[i];
        var _val = fields[_key];
        if(_val===1 || _val==0){
            _project[_key]=_val;
        }
        else if (_val instanceof Object){
            _project[_key]=parseToObject(_val,params);
        }
        else if (typeof _val==="string") {
            var _expr=expr.selector(_val,params);
            _project[_key] = _expr;
        }
    }
    this.__pipe.push(
       { $project: _project}
    );
    return this;

};
aggr.prototype.redact=function(){
    var _inputExpr=arguments[0];

    // var fields;
    var  params=[];
    fields=arguments[0];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    var _expr=expr.selector(_inputExpr,params);
    this.__pipe.push(
       { $redact: _expr}
    );
    return this;
}
/**
 * @returns {DB}
 */
aggr.prototype.getDb=function(){
    return this.db;
}
aggr.prototype.match=function(){
    var _expr=arguments[0];
    var params=[];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    this.__pipe.push({
        $match: expr.filter(_expr,params)
    });
    return this;
};
aggr.prototype.unwind = function (field, preserveNullAndEmptyArrays,includeArrayIndex){
    if (preserveNullAndEmptyArrays==undefined){
        preserveNullAndEmptyArrays=false;
    }
    if(includeArrayIndex){
        this.__pipe.push({
            $unwind:{
                path: "$" + field,
                preserveNullAndEmptyArrays: preserveNullAndEmptyArrays,
                includeArrayIndex:includeArrayIndex
            }
        });
    }
    else {
        this.__pipe.push({
            $unwind:{
                path: "$" + field,
                preserveNullAndEmptyArrays: preserveNullAndEmptyArrays
            }
        });
    }
   
    return this;
};
aggr.prototype.sort=function(fields){
    this.__pipe.push({
        $sort:fields
    });
    return this;
};
aggr.prototype.sortByCount=function(fieldName){
    this.__pipe.push({
        $sortByCount:"$"+fieldName
    });
    return this;
}
aggr.prototype.limit=function(num){
    this.__pipe.push(
        {$limit:num}
    );
    return this;
};
aggr.prototype.replaceRoot=function(){
    var newRoot=undefined;
    var params=[];
    newRoot = arguments[0];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }

    if( typeof newRoot ==="string"){
        this.__pipe.push(
            {
                $replaceRoot:{
                    newRoot:"$"+newRoot
                }
            }
        );
        return this;
    }
    if(newRoot instanceof Object){
        var keys=Object.keys(newRoot);
        if(keys.length===1 && typeof newRoot[keys[0]]==="string"){
                var x= expr.selector(newRoot[keys[0]],params);
                var n={}
                n[keys[0]]=x;    
                this.__pipe.push({
                    $replaceRoot:{
                        newRoot:n
                    }
                });
                return this;
        }
        if(newRoot instanceof Object){
            var n={};
            n[keys[0]]=parseToObject(newRoot,params);
            this.__pipe.push({
                $replaceRoot:{
                    newRoot:n
                }
                
            });
            return this;
        }
      

    }
    
};
aggr.prototype.skip=function(num){
    this.__pipe.push(
        { $skip: num }
    );
    return this;
};
aggr.prototype.lookup=function(form,localField,foreignField,alias){
    var lookup={};
    lookup.from = form;
   // lookup.from=this.name;
    lookup.localField=localField;
    lookup.foreignField = foreignField;
    lookup["as"]=alias;
    this.__pipe.push({
        $lookup:lookup
    });
    return this;

};
aggr.prototype.items=function(cb){
    require("./appy-views")(this.getDb(),this.schema);
    var me=this;
    function exec(cb){
        me.db.collection(me.name).aggregate(me.__pipe,{allowDiskUse:true}).toArray(function(e,r){
            me.__pipe =[];
            cb(e,r);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
aggr.prototype.item=function(cb){
    require("./appy-views")(this.getDb(),this.schema);
    var me = this;
    this.applyAllViews();
    function exec(cb) {
        me.db.collection(me.name).aggregate(me.__pipe).toArray(function (e, r) {
            me.__pipe = [];
            if(e) cb(e);
            else {
                if(r.length>0){
                    cb(null,r[0]);
                }
                else {
                    cb();
                }
            }
        });
    }
    if (cb) exec(cb);
    else {
        return sync.sync(exec, []);
    }
};
aggr.prototype.count=function(cb){
    require("./appy-views")(this.getDb(),this.schema);
    var tmp=[];
    for(var i=0;i<this.__pipe.length;i++){
        tmp.push(this.__pipe[i]);
    }
    this.__pipe.push({
        $count:"totalItems"
    });
    var me=this;
    function exec(cb){
        me.db.collection(me.name).aggregate(me.__pipe).toArray(function(e,r){
            me.__pipe=tmp;
            if(e){
                cb(e);
            }
            else {
                if(r.length>0){
                    cb(null,r[0].totalItems);
                }
                else {
                    cb(null,0);
                }
                
            }
        });
    }
    if(cb) exec(cb);
    else{
        return sync.sync(exec,[])
    }

}
aggr.prototype.page=function(pageIndex,pageSize,cb){
    require("./appy-views")(this.getDb(),this.schema);
    var ret={
        totalItems:0,
        pageIndex:pageIndex,
        pageSize:pageSize,
        items:[]
    };
    var tmpPager=[];
    var tmpCount=[];
    for(var i=0;i<this.__pipe.length;i++){
        tmpPager.push(this.__pipe[i]);
        tmpCount.push(this.__pipe[i]);
    }
    tmpCount.push({
        $count:"totalItems"
    });
    tmpPager.push({
        $skip:pageIndex*pageSize
    });
    tmpPager.push({
        $limit:pageSize
    });
    var coll=this.db.collection(this.name);
    var caller=sync.parallel(function(cb){
        coll.aggregate(tmpCount).toArray(function(e,r){
            if(e) cb (e);
            else {
                if(r.length>0){
                    ret.totalItems=r[0].totalItems;
                    cb(null,r[0].totalItems);
                }
                else {
                    cb(null,0);
                }
            }
        });
    },function(cb){
        coll.aggregate(tmpPager).toArray(function(e,r){
            ret.items=r;
            cb(e,r);
        });
    });
    if(cb){
        caller.callback(function(e,r){
           cb(e,ret); 
        });
    }
    else {
        caller.sync();
        return ret;
    }
};
/**
 * Group
 */
aggr.prototype.group=function(){
    var info=arguments[0];
    var params=[];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    var _id=info._id||{};
    var group={_id:{}};
    if(typeof _id==="string"){
        group._id=expr.selector(_id);
    }
    else {
        var keys=Object.keys(_id);
        for(var i=0;i<keys.length;i++){
            var key =keys[i];
            var val=_id[key];
            if(typeof val ==="string"){
                group._id[key]=expr.filter(val,params);
            }
            else {
                group._id[key]=val;
            }
        }
    }
    var keys = Object.keys(info);
    for(var i=0;i<keys.length;i++){
        var key=keys[i];
        if(key!="_id"){
            var val=info[key];
            if(typeof val ==="string"){
                group[key]=expr.filter(val,params);
            }
            else {
                group[key]=val;
            }
        }
    }
    if(info._id===null || info._id===undefined){
        group._id=undefined;
    }
    
    this.__pipe.push({
        $group:group
    });
    return this;
};
aggr.prototype.addFields=function(){
    var fields;
    var  params=[];
    fields=arguments[0];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }

    var _addFields={};
    var _keys = Object.keys(fields);
    for (var i = 0; i < _keys.length;i++){
        _key = _keys[i];
        var _val = fields[_key];
        if(_val===1 || _val==0){
            _addFields[_key]=_val;
        }
        else if (_val instanceof Object){
            _addFields[_key]=parseToObject(_val,params);
        }
        else if (typeof _val==="string") {
            var _expr=expr.selector(_val,params);
            _addFields[_key] = _expr;
        }
        else {
            _addFields[_key] = _val;
        }
    }
    this.__pipe.push(
       { $addFields: _addFields}
    );
    return this;
}
aggr.prototype.bucket=function(){
    var input=arguments[0];
    var  params=[];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    /*
        {
      groupBy: <expression>,
      boundaries: [ <lowerbound1>, <lowerbound2>, ... ],
      default: <literal>,
      output: {
         <output1>: { <$accumulator expression> },
         ...
         <outputN>: { <$accumulator expression> }
      }
    */
   if(!input.groupBy){
       throw(Error("First param require 'groupBy"));
   }
   if(!input.boundaries){
        throw(Error("First param require 'boundaries"));
   }
   if(!input.default){
        throw(Error("First param require 'default"));
   }
   if(!input.output){
        throw(Error("First param require 'output"));
   }
   var _bucket={}
   _bucket.groupBy=expr.selector(input.groupBy,params);
   _bucket.boundaries=[];
   for(var i=0;i<input.boundaries.length;i++){
       if(typeof input.boundaries[i]==="string"){
            _bucket.boundaries.push(expr.selector(input.boundaries[i],params)); 
       }
       else if(input.boundaries[i] instanceof Object){
        _bucket.boundaries.push(parseToObject(input.boundaries[i])); 
       }
       else {
            _bucket.boundaries.push(input.boundaries[i]); 
       }
       
   }
   _bucket.default=expr.selector(input.default,params);
   _bucket.output=parseToObject(input.output,params);
   this.__pipe.push({
        $bucket:_bucket
   });
   return this;

}
aggr.prototype.bucketAuto=function(){
    var input=arguments[0];
    var  params=[];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
   if(!input.groupBy){
       throw(Error("First param require 'groupBy"));
   }
   var _bucket={}
   _bucket.groupBy=expr.selector(input.groupBy,params);
   if(input.boundaries){
        _bucket.boundaries=[];
    for(var i=0;i<input.boundaries.length;i++){
        if(typeof input.boundaries[i]==="string"){
                _bucket.boundaries.push(expr.selector(input.boundaries[i],params)); 
        }
        else if(input.boundaries[i] instanceof Object){
            _bucket.boundaries.push(parseToObject(input.boundaries[i])); 
        }
        else {
                _bucket.boundaries.push(input.boundaries[i]); 
        }
        
    }
   }
   if(input.granularity){
    _bucket.granularity=expr.selector(input.granularity,params);
   }
   if(input.output){
    _bucket.output=parseToObject(input.output,params);
   }
   _bucket.buckets=input.buckets;
   this.__pipe.push({
        $bucketAuto:_bucket
   });
   return this;

}
aggr.prototype.addStages=function(){
    for(var i=0;i<arguments.length;i++){
        this.__pipe.push(arguments);
    }
    return this;
}
aggr.prototype.getPipe=function(){
    return this.__pipe;
}
aggr.prototype.stages=function(){
    var ret= new aggr();
    delete ret.item;
    delete ret.items;
    return ret;
}
aggr.prototype.filter=function(){
    var field=arguments[0];
    var params=[];
    for(var i=0;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    return expr.filter(field,params);
}
aggr.prototype.selector=function(){
    var field=arguments[0];
    var params=[];
    for(var i=0;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    return expr.selector(field,params);
}
aggr.prototype.facet=function(facePineline){
    var ret={};
    var keys=Object.keys(facePineline);
    for(var i=0;i<keys.length;i++){
        var key=keys[i];
        var val=facePineline[key];
        if(val instanceof aggr){
            ret[key]=val.getPipe();
        }
        else {
            ret[key]=val;
        }
    }
     this.__pipe.push({
         $facet:ret
     });
     return this;   

}
aggr.prototype.createView=function(name){
    global.__mongodb__views__[name]={
        name:name,
        source:this.name,
        pipe:this.__pipe
    }
    return this;
}

module.exports = function (db, name) {
    return new aggr(db, name);
};