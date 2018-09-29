var pageReader=require("./page-get-content");
var pageComipler=require("./page-compiler");
var requestExt=require("./request-ext");
var requestPost=require("./request-post");
var bodyParser = require("body-parser");
var pageNunjuksExtent=require("./page-nunjucks-extent");
var count=0;
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
        //var next=null;
        var model = {
            form:{}
        };
        requestExt(me,model,req,res);
        var info=pageReader.loadFile(req,res,me.info.file,me);
        
        //var extentInfo=
        me.info.dirName=info.dirName;
        me.info.fileName=info.fileName;
        me.info.rootDir=info.rootDir;
        me.info.relDir=info.relDir;
        me.info.relFileName=info.relFileName;
        me.info.extentInfo = info.extentInfo;
        //require("./page-language").syncLanguage(req,me.info.resItems);
        var extentFn={
            load:function(){},
            post:function(){}
        };
        if(info.extentInfo && info.extentInfo.runner){
            extentFn = info.extentInfo.runner(model, req, res, next);
        }
        if(info.runner){
            var retFn = info.runner(model, req, res, next);
            if (retFn.load) {
               extentFn.load();
               retFn.load();
            }
            if(req.body){
                var data=requestPost(req,res,next);
                 if (retFn.post){
                     extentFn.load(req.postData);
                    retFn.post(req.postData);
                    
                }
             }
        }
        
        info.url=me.info.url;
        info.keyPath=trim(info.url,'/');
        var ret = pageComipler.compiler(me,req,info, model);
        
        res.set('Content-Type', 'text/html');
        res.end(ret);
        //res.send(ret);
        //var x=req;
    };
    me.exec.__count__=count;
    count++;

}
var lst=[];
module.exports=function(app,info){
    var ret = new excutor(app, info);
    lst.push(ret);
    ret.exec.owner=ret;
    return ret.exec;
};