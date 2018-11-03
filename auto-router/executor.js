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
function execIncludeRunner(list,model, req, res, next){
    for(var i=0;i<list.length;i++){
        var info=list[i];
        var x = info.extentInfo;
        var runners=[];
        while (x){
            if(x.runner){
                runners.push(x.runner);
            }
            x=x.extentInfo;
        }
        for(var j=runners.length-1;j>=0;j--){
            runners[j](model, req, res, next);
            if(res.headersSent){
                return;
            }
        }
        if(info.runner){
            var retFn = info.runner(model, req, res, next);
            if(res.headersSent){
                return;
            }
            if(info.includeInfo){
                execIncludeRunner(info.includeInfo,model, req, res, next);
            }
            
        }
        else {
            if(info.includeInfo){
                execIncludeRunner(info.includeInfo,model, req, res, next);
            }
        }
    }
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
        var runners=[];
        var x = info.extentInfo;
        while (x){
            if(x.runner){
                runners.push(x);
            }
            x=x.extentInfo;
        }
        execIncludeRunner(runners.reverse(),model, req, res, next);
        if(res.headersSent){
            return;
        }
        if (info.runner && typeof info.runner === "function"){
            var retFn = info.runner(model, req, res, next)||{};
            if(req.header("AJAX-POST") && retFn.ajax && retFn.ajax[req.header("AJAX-POST") ]){
                var jsonData=require("../q-json").fromJSON(req.body);
                var retJSON=retFn.ajax[req.header("AJAX-POST") ](jsonData);
                res.end(JSON.stringify(retJSON||{}));
                return;
            }
            if(res.headersSent){
                return;
            }
            execIncludeRunner(info.includeInfo,model, req, res, next);
            if (retFn.load) {
               extentFn.load();
               if(res.headersSent){
                    return;
                }
               retFn.load();
               if(res.headersSent){
                return;
               }
            }
            if(req.body){
                var data=requestPost(req,res,next);
                 if (retFn.post){
                     extentFn.load(req.postData);
                    retFn.post(req.postData);
                    if(res.headersSent){
                        return;
                    }
                }
             }
        }
        else {
            execIncludeRunner(info.includeInfo,model, req, res, next);
            if(res.headersSent){
                return;
            }
        }
        info.url=me.info.url;
        info.keyPath=trim(info.url,'/');
        var ret = pageComipler.compiler(me,req,info, model);
        if(!res.headersSent){
            res.set('Content-Type', 'text/html');
            res.end(ret);
        }
        
        //res.send(ret);
        //var x=req;
    };
    me.exec.__count__=count;
    count++;

}
var lst=[];
module.exports={
    handler:function(app,info){
        var ret = new excutor(app, info);
        lst.push(ret);
        ret.exec.owner=ret;
        return ret.exec;
    },
    execCode:execIncludeRunner
};
