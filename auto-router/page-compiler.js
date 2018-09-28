var ECT = require('ect');
var uuid=require("uuid");
var sync=require("../q-sync");
var path=require("path");
var fs=require("fs");
var pageLockRuner=require("./page-lock-runner");
var map={};
var remap={};
var rootDir=require('path').dirname(require.main.filename)+"/temp";
function compiler(info,model){
    uuid.v1()    
    var x=ECT;
    var renderFile;
    if(map[info.originFile]){
        info.renderFile=map[info.originFile];
        
    }
    else {
        pageLockRuner(function(cb){
            try {
                    if (!fs.existsSync(rootDir)) {
                        fs.mkdirSync(rootDir);
                    }
                    var items=info.keyPath.split('/');
                    var _rootDir=rootDir;
                    for(var i=0;i<items.length-1;i++){
                        _rootDir=path.join(_rootDir,items[i]);
                        if (!fs.existsSync(_rootDir)) {
                            fs.mkdirSync(_rootDir);
                        }
                    }
                    _rootDir=path.join(_rootDir,path.basename(info.originFile));
                    fs.writeFileSync(_rootDir, info.content);
                    info.renderFile=_rootDir;
                    map[info.originFile]=_rootDir;
                    cb(undefined,map[info.originFile])
            } catch (error) {
                cb(error);
            }
        });
    }
   
    var ECT = require('ect');

    var renderer = ECT();
    renderer.render.prototype.test = () => { };
    var html = renderer.render(info.renderFile, model);
    return html;
}
module.exports={
    compiler:compiler,
    clearCache:function(){
        map={};
    }
};