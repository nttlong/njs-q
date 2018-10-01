var key= "auto-router-lock-key";
var sync=require("../q-sync");
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
module.exports=function(fn,_key){
    function run(cb){
        lock.acquire(_key||key,function(done){
            fn(done);
        },function(e,r){
            cb(e,r);
        });
    }
    return sync.sync(run,[]);
}