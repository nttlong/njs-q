var sync=require("../q-sync");
function checkIsExit(client,index,cb){
    function run(cb){
        client.indices.exists({
             index: index
            },function(e,r){
                cb(e,r);

            });
    }
    if(cb) run(cb);
    else {
        return sync.sync(run, []);
    }
    
}
function createIndex(client,index,cb){
    function run(cb) {
        client.indices.create({
            index: index
        }, function (e, r) {
            cb(e, r);

        });
    }
    if(cb) run(cb);
    else {
        return sync.sync(run, []);
    }
    
}
function checkIsExists(client,index,type,id,cb){
    function run(cb){
        client.exists({
            index: index,
            type: type,
            id: id
        },function(e,r){
            cb(e,r);
        });
    }
    if(cb) run(cb);
    else {
        return sync.sync(run, []);    
    }
    return sync.sync(run,[]);
    
}
function deleteById(client,index,type,id,cb){
    function run(cb){
        client.delete({
            index: index,
            type: type,
            id: id
        }).then(function(r){
            cb(undefined,r);
        }).catch(function(ex){
            cb(ex);
        });
    }
    if(cb){
        run(cb);
    }
    else {
        return sync.sync(run,[])
    }
}
function es_indexes(client,index,type){
    var me=this;
    me.index=index;
    me.type=type;
    me.__client=client;
    // me.searchText=
   
    // me.count=function(){

    // }
}
es_indexes.prototype.searchText = function (text, callback) {
    var me=this;
    var client = me.__client;
    function run(cb){
        client.search({
            index: me.index,
            type: me.type,
            q:text
            
        }, function (e, r, s) {
            if(e){
                cb(e);
                return;
            }
            if(r.hits){
                cb(e, r.hits);
            }
            else {
                cb(null,null);
            }
           

        });
    }
    if (callback){
        run(callback);
    }
    else{
        return sync.sync(run, []);
    }
    
};
es_indexes.prototype.exists = function (id, callback) {
    return checkIsExists(this.__client,this.index,this.type,id,callback);
};
es_indexes.prototype.delete = function (id, callback) {
    return deleteById(this.__client, this.index, this.type, id, callback);
};
es_indexes.prototype.create = function (id, body, callback) {
    
    var me=this;
    var client = me.__client;
    var isExist = checkIsExit(me.__client, me.index);
    if(!isExist){
        createIndex(me.__client,me.index);
    }
    isExist = checkIsExists(me.__client,me.index,me.type,id);
    if(isExist){
        deleteById(me.__client,me.index,me.type,id);
    }
    function run(cb){
        client.create({
            index: me.index,
            type: me.type,
            body: body,
            id: id
        }).then(function (result) {
            cb(null, result);
        }).catch(function (ex) {
            
            cb(ex);
        });
    }
    if(callback){
        run(callback);
    }
    else {
        return sync.sync(run,[]);
    }
};
module.exports=es_indexes