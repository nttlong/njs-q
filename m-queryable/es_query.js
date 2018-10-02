//https://n1rlchusq2:43a7ycvgmb@app-name-nttlong-8709556953.eu-west-1.bonsaisearch.net
var elasticsearch=require('elasticsearch');
var utils=require("./utils");
var sync=require("./sync");
function connect(key,urls){
    if(!global.__es_query_connections){
        global.__es_query_connections={};
    }
    if(!global.__es_query_connections[key]){
        global.__es_query_connections[key]=new elasticsearch.Client( {  
            hosts: urls
        });
    }
}
function getCnnNames(){
    return Object.keys(global.__es_query_connections);
}
function getClient(key){
    return global.__es_query_connections[key];
}
function check(key,cb){
    function exec(cb){
        getClient(key).cluster.health({},function(err,resp,status) {  
            cb(err,{
                data:resp,
                status:status
            })
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    };
   
}
function getAllIndexes(key,cb){
    function exec(cb){
        getClient(key).cat.indices({
            h: ['index']
          }).then(function (body) {
             cb(undefined,body);
        }).catch(function(ex){
            cb(ex);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
}
function postData(key,index,type,id,body,cb){
    body=utils.trimData(body);
    function exec(cb){
        getClient(key).index({
            index:index,
            id:id,
            type:type,
            body:body
        },function(error,res,status){
            cb(error,res);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
function search(key,index,type,searchText,pageSize,pageIndex,cb){
    function exec(cb){
        getClient(key).search({
            index: index,
            type: type,
            from : pageIndex*pageSize,
            size : pageIndex,
            q: searchText
        }).then(function(res) {
            cb(undefined,res.hits);
        }, function(err) {
            cb(err);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
}
function searchByField(key,index,type,field,searchText,pageSize,pageIndex,cb){
    var query={term:{}};
    query.term[field]=searchText;
    function exec(cb){
        getClient(key).search({
            index: index,
            type: type,
            from : pageIndex*pageSize,
            size : pageIndex,
            body:{
                query : query
            }
            
        }).then(function(res) {
            cb(undefined,res.hits);
        }, function(err) {
            cb(err);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
}
function getAll(key,index,type,cb){
    function exec(cb){
        var allRecords = [];
        getClient(key).search({
            index: index,
            type: type,
            scroll: '10s',
            body: {
                query: {
                    "match_all": {}
                }
            }
        }, function getMoreUntilDone(error, response) {
            if(error){
                cb(error);
                return;
            }
            response.hits.hits.forEach(function (hit) {
                allRecords.push(hit);
            });

            if (response.hits.total !== allRecords.length) {
                // now we can call scroll over and over
                getClient(key).scroll({
                scrollId: response._scroll_id,
                scroll: '10s'
                }, getMoreUntilDone);
            } else {
                cb(undefined,allRecords);
            }
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
}
function createIndex(key,index,cb){
    function exec(cb){
        getClient(key).indices.create({
            index: index
        }, function(err, resp, status) {
            if (err) {
                cb(err);
            } else {
                cb(undefined,resp);
            }
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
function deleteIndex(key,index,cb){
    function exec(cb){
        getClient(key).indices.delete({
            index: index
        }, function(err, res) {
        
            if (err) {
               cb(err);
            } else {
                cb(undefined,res)
            }
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
function isExist(key,index,cb){
    function exec(cb){
        getClient(key).indices.exists({
            index: index
        }).then(function(r){
            cb(undefined,r);
        }).catch(function(e){
            cb(e);
        });
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
module.exports = {
    connect:connect,
    check:check,
    getCnnNames,
    getAllIndexes:getAllIndexes,
    postData:postData,
    search:search,
    getAll:getAll,
    createIndex:createIndex,
    deleteIndex:deleteIndex,
    isExist:isExist,
    searchByField:searchByField
}
