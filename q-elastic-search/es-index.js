var sync=require("../q-sync");
function checkIsExit(client,index){
    function run(cb){
        client.indices.exists({
             index: index
            },function(e,r){
                cb(e,r);

            });
    }
    return sync.sync(run,[]);
}
function createIndex(client,index){
    function run(cb) {
        client.indices.create({
            index: index
        }, function (e, r) {
            cb(e, r);

        });
    }
    return sync.sync(run, []);
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
            cb(e, r);

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
    var me=this;
    var client = me.__client;
    function run(cb){
        client.exists({
            index: me.index,
            type: me.type,
            id: id
        }).then(function (res) {
            cb(null, res);
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
}
es_indexes.prototype.delete = function (id, callback) {
    var me=this;
    var client = me.__client;
    function run(cb){
        client.delete({
            index: me.index,
            type: me.type,
            id: id
        }).then(function (result) {
            cb(null, result);
        }).catch(function (ex) {
            cb(ex);
        });
    }
    if(callback){
        run(cb);
    }
    else {
        return sync.sync(run,[]);
    }
};
es_indexes.prototype.create = function (id, body, callback) {
    
    var me=this;
    var client = me.__client;
    var isExist = checkIsExit(me.__client, me.index);
    if(!isExist){
        createIndex(me.__client,me.index);
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