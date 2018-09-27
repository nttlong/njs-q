var pageReader=require("./page-get-content");
var pageComipler=require("./page-compiler");
var requestExt=require("./request-ext");
var requestPost=require("./request-post");
var bodyParser = require("body-parser");
function trim(txt,c){
    while(txt[0]===c){
        txt=txt.substring(1,txt.length);
    }
    while(txt[txt.length-1]===c){
        txt=txt.substring(0,txt.length-1);
    }
    return txt;
}
function excutor(app,info){
    this.app=app;
    this.info=info;
    var me=this;

    me.exec=function(req,res,next){
        var info=pageReader.loadFile(me.info.file);
        var model = {
            form:{}
        };
        requestExt(info,model,req,res);
        
        var retFn = info.runner(model, req, res, next);
        if (retFn.load) {
            retFn.load();
        }
        if(req.body){
           var data=requestPost(req,res,next);
            if (retFn.post){
               retFn.post(req.postData);
               
           }
        }
        info.url=me.info.url;
        info.keyPath=trim(info.url,'/');
        var ret = pageComipler.compiler(info, model);
        
        res.set('Content-Type', 'text/html');
        res.send(ret);
        //var x=req;
    }

}
module.exports=function(app,info){
    return (new excutor(app,info)).exec;
}