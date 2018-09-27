var key= "auto-router-lock-key";
var sync=require("quicky/q-sync");
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
module.exports=function(fn){
    function run(cb){
        lock.acquire(key,function(done){
            fn(done);
        },function(e,r){
            cb(e,r);
        });
    }
    return sync.sync(run,[]);
}