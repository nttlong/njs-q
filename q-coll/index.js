var e=require("./expr");
var sync=require("./sync");
var mg=require("mongoose");
var aggr=require("./aggr");
var utils=require("./utils");
var models=require("./models");
var applyAll=require("./model_validator").applyAll;
var errors=require("./errors");
var DB=require("mongodb").Db;
global.__q_coll_database__={};
global.__mongoose_connections__={};
global.__mongoose_uri_connections__={};
global.__mongoose_names_connections__={};
global.__mongodb_validators_has_created__={};
global.__mongodb_index_has_created__={};
global.__mongodb_database_context__=[];
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
function coll(_db,schema,name){
    if(!name){
        name=schema;
        schema=undefined;
    }
    if(typeof _db=="string"){
        _db=db(_db);
        this._cnn=_db.___cnn;
    }
    this.db = _db;
    this.name=name;
    this.schema=schema;
    this.__aggr=undefined;
}
coll.prototype.setDb=function(_db){
    if(typeof _db=="string"){
        _db=db(_db);
        this._cnn=_db.___cnn;
    }
    this.db = _db;
    return this;
}
coll.prototype.setSchema=function(schema){
    this.schema=schema;
    return this;
}
/**
 * @returns {DB} 
 */
coll.prototype.getDb=function(){
    return this.db;
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
    require("./appy-views")(this.getDb(),this.schema);
    var me=this;
    var coll = me.db.collection(me.name);
    if(me.schema){
        coll = me.db.collection(me.schema+"."+ me.name);
    }
    function exec(cb){
        var _where=me.__where||{};
        coll.find(_where).toArray(function(e,r){
            cb(e,r);
        });
    }
    if(cb) exec(cb);
    else return sync.sync(exec,[]);
};
coll.prototype.item = function (cb) {
    require("./appy-views")(this.getDb(),this.schema);
    var me = this;
    var coll = me.db.collection(me.name);
    if(me.schema){
        coll = me.db.collection(me.schema+"."+ me.name);
    }
    function exec(cb) {
        
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

coll.prototype.createValidator=function(){
    var me=this;
    me.createIndex
    if(!this.schema){
        if(!global.__mongodb_validators_has_created__[this.name]){
            var cmd=models.getValidator(this.name);
            if(cmd){
                function create_validator(cb){
                    me.getDb().eval("db.runCommand("+JSON.stringify(cmd)+")",function(e,r){
                        cb(e,r);
                    });
                }
                sync.sync(create_validator,[]);
                global.__mongodb_validators_has_created__[this.name]=1;
            }
            
        }
    }
    else {
        if(!global.__mongodb_validators_has_created__[this.schema+"."+ this.name]){
            var cmd=models.getValidator(this.name);
            cmd.collMod=this.schema+"."+cmd.collMod;
            if(cmd){
                function create_validator(cb){
                    me.getDb().eval("db.runCommand("+JSON.stringify(cmd)+")",function(e,r){
                        cb(e,r);
                    });
                }
                sync.sync(create_validator,[]);
                global.__mongodb_validators_has_created__[this.schema+"."+ this.name]=1;
            }
            
        }
    }
}
var __mongodb_collection_index_info={}
coll.prototype.getIndexInfo=function(index,cb){
    var key=this.name;
    if(this.schema){
        key=this.schema+"."+this.name;
    }
    if(__mongodb_collection_index_info[key] &&
        __mongodb_collection_index_info[key][index] ){
        if(cb) cb(null,__mongodb_collection_index_info[key][index]);
        else return __mongodb_collection_index_info[key][index];
    }
    else {
        var _coll=this.getDb().collection(key);
        function run(cb){
            _coll.indexInformation().then(function(r){
                if(!__mongodb_collection_index_info[key]){
                    __mongodb_collection_index_info[key]={}
                }
                __mongodb_collection_index_info[key][index]=[];
                for(var i=0;i<r[index].length;i++){
                    __mongodb_collection_index_info[key][index].push(r[index][i][0]);
                }
                cb(null,r);
            }).catch(function(ex){
                cb(ex);
            })
        }
        if(cb) run(cb);
        else {
            sync.sync(run,[]);
            return __mongodb_collection_index_info[key][index];
        }
    }
    // var info=this.getInfo();
}
coll.prototype.getIndexNameFromError=function(errmsg){
    return errmsg.split(":")[2].split(" ")[1];
}
coll.prototype.commit=function(cb){
    var me = this;
    me.createUniqueIndex();
    me.createValidator();
    require("./appy-views")(this.getDb(),this.schema);
    var _coll=me.db.collection(me.name);
    if(me.schema){
        _coll=me.db.collection(me.schema+"."+ me.name);
    }
    function exec(cb) {
        if (me.__insert){
            var data=me.__insert;
            if (data instanceof Array) {
                _coll.insertMany(data, function (e, r) {
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
                _coll.insertOne(data, function (e, r) {
                    var ret={
                        data:data
                    }
                    if(e.code===11000){
                        var info=me.getIndexInfo(me.getIndexNameFromError(e.errmsg));
                        ret.error={
                            code:"duplicate",
                            fields:info[0][0]
                        }
                        cb(null, ret);
                        return;
                    }
                    if(e && e.code==121){
                        
                        var retError=validateData(me.createInstance(),me.getInfo().options.validator||{},data);
                        if(retError && retError.code=="required"){
                            ret.error={
                                code:"required",
                                fields:retError.fields
                            }
                            cb(null, ret);
                            return;
                        }
                        
                    }
                    if(e) {
                        cb(e);
                    }
                    else {
                        ret.data._id = r.insertedId;
                        me.__insert = undefined;
                        cb(e, ret);
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
            if(me.__inc){
                data.$inc=me.__inc;
                me.__inc=undefined
            }
            if(me.__dec){
                data.$dec=me.__dec;
                me.__dec=undefined;
            }
            var _where={};
            if(me.__where){
                _where=me.__where;
            }
            _coll.updateMany(_where,data).then(function(r){
                    if(e.code===11000){
                        var info=me.getIndexInfo(me.getIndexNameFromError(e.errmsg));
                        ret.error={
                            code:"duplicate",
                            fields:info[0][0]
                        }
                        cb(null, ret);
                        return;
                    }
                    if(e && e.code==121){
                        
                        var retError=validateData(me.createInstance(),me.getInfo().options.validator||{},data);
                        if(retError && retError.code=="required"){
                            ret.error={
                                code:"required",
                                fields:retError.fields
                            }
                            cb(null, ret);
                            return;
                        }
                        
                    }
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
coll.prototype.inc=function(data){
    this.__inc=data;
    return this;
}
coll.prototype.dec=function(data){
    this.__dec=data;
    return this;
}
coll.prototype.delete=function(cb){
    if(!this.__where||
        Object.keys(this.__where).length==0){
            throw("Can not delete without 'where'");
        return;

    }
    var me=this;
    var _coll=me.getDb().collection(me.name);
    if(me.schema){
        _coll=me.getDb().collection(me.schema+"."+ me.name);
    }
    function exec(cb){
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
    return aggr(this.db,this.name,this.schema);
};
coll.prototype.createUniqueIndex=function(){
    var key=this.name;
    if(this.schema){
        key=this.schema+"."+key
    }
    var _coll=this.getDb().collection(key);
    if(global.__mongodb_indexes__[this.name]){
        if(!global.__mongodb_index_has_created__[key]){
            var lst=global.__mongodb_indexes__[this.name];
            var p=sync.parallel();
                for(var i=0;i<lst.length;i++){
                    p.call(function(cb){
                        _coll.createIndex(lst[i],{
                            unique: true 
                        },function(e,r){
                            cb(e,r);   
                            });
                    });
                }
            p.sync()
            
            global.__mongodb_index_has_created__[key]=1;
        }
    }
};
var __mongodb_collection_info__={};
coll.prototype.getInfo=function(cb){
    var key=this.name;
    if(this.schema) {
        key=this.schema+"."+this.name;
    }
    
    if(__mongodb_collection_info__[key]){
        if(cb) cb(null,__mongodb_collection_info__[key]);
        else return __mongodb_collection_info__[key];
    }
    var me=this;
    function exec(cb){
        me.db.eval('db.getCollectionInfos({name:"'+key+'"})',function(e,r){
            if(e) cb(e);
            else {
                if(r.length==0){
                    __mongodb_collection_info__[key]={};
                    cb(undefined,{});
                }
                else {
                    __mongodb_collection_info__[key]=r[0];
                    cb(undefined,r[0]);
                }
            }
        });
    }
    if(cb) exec(cb);
    else {
        __mongodb_collection_info__[key]= sync.sync(exec,[]);
        return __mongodb_collection_info__[key];
    }
};
coll.prototype.createInstance=function(){
    return models.create(this._cnn,models.getModelNameByCollectionName(this.name));

}
/**
 * 
 * @param {DBContextFactory} context 
 */
function Excutor(context){

}
function Context(db,schema){
    this.db=db;
    this.schema=schema;
   
}


function DBContextFactory(_db,schema){
    this.db=_db;
    this.schema=schema;    
    if(typeof _db=="string"){
        _db=db(_db);
        
    }
    this.dbInstance=_db;
}
/**
 * @returns {DB}
 */
DBContextFactory.prototype.getDb=function(){
    return this.dbInstance;
}
/**
 * 
 * @param {string} name 
 * @returns {coll}
 */
DBContextFactory.prototype.coll=function(name){
    var coll=require("./index").coll;
    if(this.schema){
        return coll(this.db,this.schema,name);
    }
    else{
        return coll(this.db,name);
    }
    
}
DBContextFactory.prototype.sync=function(fn){
    function run(cb){
        fn(cb);
    }
    return require("./sync").sync(run,[])
}
/**
 * 
 * @param {string} db 
 * @param {string} schema 
 * @param {Excutor} excutors 
 */
function use(db,schema,excutors){
    excutors(new DBContextFactory(db,schema));
}
module.exports ={
    coll:function(db,schema,name){
        return new coll(db,schema,name);
    },
    query:function(name){
        return new coll(undefined,name);
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
    errors:require("./errors"),
    use:use,
    Collection:coll
}