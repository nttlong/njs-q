var pageReader=require("./page-get-content");
var pageComipler=require("./page-compiler");

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
        info.url=me.info.url;
        info.keyPath=trim(info.url,'/');
        var ret=pageComipler.compiler(info);
        res.set('Content-Type', 'text/html');
        res.send(ret);
        //var x=req;
    }

}
module.exports=function(app,info){
    return (new excutor(app,info)).exec;
}