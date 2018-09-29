require("../q-extension");
var apps=require("../q-apps");
var express = require('express');
var loader=require("./load-from-dir");
var path=require('path');
var  router = express.Router();
var executor=require("./executor");
function create(appHostDir,appDir,router,app){
    var urls=loader(appHostDir,appDir);
    if(appHostDir && appHostDir!=""){
        router.use("/".join("",appHostDir,"static"),express.static(path.sep.join(app.fullHostDir,'static')));
    }
    else {
        router.use("/static",express.static(path.sep.join(app.fullHostDir,'static')));
    }
    
    urls =urls.sort(function(x,y){
        return y.url.length-x.url.length;
    });
    for(var i=0;i<urls.length;i++){
        var x=new RegExp("\\"+path.sep+"index\\:.*\\.html");
        var m=x.exec(urls[i].file);
        var url=urls[i].url;
        if(m){
            var n=/\/index\$.*/.exec(url);
            url=url.replace(n[0],"");
            var p=urls[i].url.substring(n.index,urls[i].url.length);
            var index=p.indexOf('$');
            p=p.substring(index,p.length);
            url=url+"/"+p;

        }
        var runUrl = url.replaceAll("$", "/:");
        console.log(runUrl);
        router.use(runUrl,executor(app,urls[i]));
    }
    return;

}
module.exports=create;
