require("../q-extension");
var apps=require("../q-apps");
var express = require('express');
var loader=require("./load-from-dir");
var path=require('path');
var  router = express.Router();
global["__list_of_apps__"]={};
var executor=require("./executor");
function create(appHostDir,appDir,router,app,appServer){
    if (global["__list_of_apps__"][appDir]){
        return;
    }
    var urls=loader(appHostDir,appDir);
    if(appHostDir && appHostDir!=""){
        router.use("/".join("",appHostDir,"static"),express.static(path.sep.join(app.fullHostDir,'static')));
    }
    else {
        router.use("/static",express.static(path.sep.join(app.fullHostDir,'static')));
    }
    urls =urls.sort(function(x,y){
        return x.url.length-y.url.length;
    });
    var r = express.Router();
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
        
        // console.log(runUrl);
        // r.all(runUrl, executor(app, urls[i]));
        if (appHostDir && appHostDir != "") {
            router.all("/" + appHostDir+"/"+runUrl,
                executor(app, urls[i]));
        }
        else {
            router.use("/"+runUrl, 
                executor(app, urls[i]));
        }

    }
    
    global["__list_of_apps__"][appDir]=appDir;
    return;

}
module.exports=create;
