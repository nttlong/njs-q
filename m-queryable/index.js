var e=require("./expr");
var sync=require("./sync");
var mg=require("mongoose");
var aggr=require("./aggr");
var utils=require("./utils");
var models=require("./models");
var applyAll=require("./model_validator").applyAll;
var errors=require("./errors");
global.__q_coll_database__={};
global.__mongoose_connections__={};
global.__mongoose_uri_connections__={};
global.__mongoose_names_connections__={};
global.__mongodb_validators_has_created__={};
function validateData(model,validators,data){
    var ret={
        code:undefined,
        fields:[]
    }
    if(validators.$jsonSchema && validators.$jsonSchema.required){
        for(var i=0;i<validators.$jsonSchema.required.length;i++){
            var val=model.getValue(validators.$jsonSchema.required[i]);
            if(val==undefined || val==null){
                ret.code="required";
                ret.message="Fields are missing"
                ret.fields.push(validators.$jsonSchema.required[i])

            }
        }
        if(ret.code){
            return ret;
        }
    }
    var keys=Object.keys(data||{});
    for(var i=0;i<keys.length;i++){
        model[keys[i]]=data[keys[i]];
    }
    return model.validateSync();
}
function getVersion(key,cb){
    function exec(cb){
        global.__q_coll_database__[key].eval("function(){return db.version();}",cb);
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
}
function getConnect(){
    var key,uri,cb;
    key =arguments[0];
    if(arguments.length>1){
        uri=arguments[1];
    }
    if(arguments.length===3){
        cb=arguments[2];
    }
    function exec(cb){
        if(global.__mongoose_connections__[key]){
            cb(undefined,global.__mongoose_connections__[key]);
            return;
        }
        mg.connect(uri).then(function (cnn) {
            global.__mongoose_connections__[key]=cnn;
            cb(null,cnn);
        }).catch(function(ex){
            cb(ex);
        });
    }
    if(cb) exec(cb);
    else return sync.sync(exec,[]);
}
function connect(uri,cb){
    function exec(cb){
        mg.connect(uri).then(function (cnn) {
            var db=cnn.connection.db;
            db.___cnn=cnn;
            cb(null,db);
        }).catch(function(ex){
            cb(ex);
        });
    }
    if(cb) exec(cb);
    else return sync.sync(exec,[]);
}
function db(name,uri){
    if (global.__q_coll_database__[name]){
        return global.__q_coll_database__[name]; 
    }
    else {
        global.__q_coll_database__[name]=connect(uri);
        return global.__q_coll_database__[name]; 
    }
}
function coll(_db,name){
    
    if(typeof _db=="string"){
        _db=db(_db);
        this._cnn=_db.___cnn;
    }
    if(!global.__mongodb_validators_has_created__[name]){
        var cmd=models.getValidator(name);
        if(cmd){
            function create_validator(cb){
                _db.eval("db.runCommand("+JSON.stringify(cmd)+")",function(e,r){
                    cb(e,r);
                });
            }
            sync.sync(create_validator,[])
        }
           
    }
    this.db = _db;
    this.name=name;
    this.__aggr=undefined;
}
coll.prototype.where=function(){
    if(arguments.length==0){
        throw("Param is missing");
    }
    var expr=arguments[0];
    var params=[];
    if(arguments.length>1){
        for(var i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }
    }
    this.__where=e.filter(expr,params);
    return this;
};
coll.prototype.items=function(cb){
    var me=this;
    function exec(cb){
        var coll=me.db.collection(me.name);
        var _where=me.__where||{};

        coll.find(_where).toArray(function(e,r){
            cb(e,r);
        });
    }
    if(cb) exec(cb);
    else return sync.sync(exec,[]);
};
coll.prototype.item = function (cb) {
    var me = this;
    function exec(cb) {
        var coll = me.db.collection(me.name);
        var _where = me.__where || {};

        coll.findOne(_where,function (e, r) {
            cb(e, r);
        });
    }
    if (cb) exec(cb);
    else return sync.sync(exec, []);
};
coll.prototype.insert=function(data,cb){
    this.__insert=utils.trimData(data);
    this.__set = undefined;
    return this;
    
};
coll.prototype.commit=function(cb){
    var me = this;
    function exec(cb) {
        if (me.__insert){
            var data=me.__insert;
            if (data instanceof Array) {
                me.db.collection(me.name).insertMany(data, function (e, r) {
                    if (e) cb(e);
                    else {
                        var ids = r.insertedIds;
                        for (var i = 0; i < ids.length; i++) {
                            data[i]._id = ids[i];
                        }
                    }
                    me.__insert=undefined;
                    cb(e, data);
                });
            }
            else {
                me.db.collection(me.name).insertOne(data, function (e, r) {
                    if(e && e.code==121){
                        var retError=validateData(me.createInstance(),me.getInfo().options.validator||{},data);
                        if(retError && retError.code=="required"){
                            var err=new  errors.MissingFields(retError.message,retError.fields);
                            cb(err);
                            return;
                        }
                        
                    }
                    if (e) cb(e);
                    else {
                        data._id = r.insertedId;
                        me.__insert = undefined;
                        cb(e, data);
                    }
                });
            }
        }
        else {
            var data={};
            if(me.__set){
                data.$set = me.__set;
                me.__set =undefined;
            }
            if(me.__push){
                data.$push=me.__push;
                me.__push = undefined;
            }
            if(me.__pull){
                data.$pull=me.__pull;
                me.__push=undefined;
            }
            var _where={};
            if(me.__where){
                _where=me.__where;
            }
            me.db.collection(me.name)
                .updateMany(_where,data).then(function(r){

                cb(null,r);
            }).catch(function(e){
                if(e.code==121){
                    var x=validateData(me.createInstance(),data);
                }
                cb(e);
            });
            
        }
        
    }
    if (cb) exec(cb);
    else return sync.sync(exec, []);
};
coll.prototype.set=function(data){
    data=utils.trimData(data);
    var me=this;
    if(!me.__set){
        me.__set = {};
    }
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] != "_id") {
            me.__set[keys[i]] = data[keys[i]];
        }
    }
    return this;
};
coll.prototype.push=function(data){
    data=utils.trimData(data);
    this.__push=data;
    return this;
};
coll.prototype.pull=function(){
    if(arguments.length==0){
        throw("param is require");
    }
    var expr=arguments[0];
    var params=[];
    for(var i=1;i<arguments.length;i++){
        params.push(arguments[i]);
    }
    if(!this.__pull){
        this.__pull={};
    }
    var __where = e.filter(expr, params);
    var key = Object.keys(__where)[0];
    this.__pull[key] = __where[key];
    return this;

};
coll.prototype.delete=function(cb){
    if(!this.__where||
        Object.keys(this.__where).length==0){
            throw("Can not delete without 'where'");
        return;

    }
    var me=this;
    function exec(cb){
        var coll=me.db.collection(me.name);
        coll.deleteMany(me.__where,function(e,r){
            cb(e,r);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
    
};
coll.prototype.aggregate=function(){
    return aggr(this.db,this.name);
};
coll.prototype.createIndex=function(){
    var keys,options,cb;
    keys=arguments[0];
    if(arguments.length==2){
        cb=arguments[1];
    }
    if(arguments.length==3){
        options=arguments[1];
        cb=arguments[2];
    }
    var me=this;
    function exec(cb){
        me.db.collection(me.name).createIndex(keys,options,cb)
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
coll.prototype.getInfo=function(cb){
    var me=this;
    function exec(cb){
        me.db.eval('db.getCollectionInfos({name:"'+me.name+'"})',function(e,r){
            if(e) cb(e);
            else {
                if(r.length==0){
                    cb(undefined,{});
                }
                else {
                    cb(undefined,r[0]);
                }
            }
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
coll.prototype.createInstance=function(){
    return models.create(this._cnn,models.getModelNameByCollectionName(this.name));

}
module.exports ={
    coll:function(db,name){
        return new coll(db,name);
    },
    connect:connect,
    db:db,
    es:function(key,index,type){
        var ES=require("./es");
        return ES.create(key,index,type);
    },
    esConnect:function(key,urls){
        var ES=require("./es");
        return ES.connect(key,urls);
    },
    getVersion:getVersion,
    createValidator:require("./model_validator").create,
    applyAllValidators:require("./model_validator").applyAll,
    getConnect:getConnect,
    schema:models.schema,
    errors:require("./errors")
    
}