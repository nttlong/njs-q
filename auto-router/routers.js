var express = require('express');
var loader=require("./load-from-dir");
var path=require('path')
var excutor=require("./excutor");
function create(appHostDir,appDir,router,app){
    var urls=loader(appHostDir,appDir);
    router.use('/static',express.static(path.join(appHostDir,'/static')));
    for(var i=0;i<urls.length;i++){
        router.use(urls[i].url,excutor(app,urls[i]));
    }


}
module.exports=create