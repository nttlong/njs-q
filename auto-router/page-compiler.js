var ECT = require('ect');
var nunjucks = require( 'nunjucks' ) ;
var uuid=require("uuid");
var sync=require("../q-sync");
var path=require("path");
var fs=require("fs");
var pageLockRuner=require("./page-lock-runner");
var map={};
var remap={};
var rootDir=path.sep.join(path.dirname(require.main.filename),"temp");
function _compile(context, req, info, model){
    if (!map[req.getLanguage()]) {
        map[req.getLanguage()] = {};
    }
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir);
    }
    
    var _rootDir = path.sep.join(rootDir, req.getLanguage());
    if (!fs.existsSync(_rootDir)) {
        fs.mkdirSync(_rootDir);
    }
    _rootDir = path.sep.join(_rootDir, context.app.name);
    if (!fs.existsSync(_rootDir)) {
        fs.mkdirSync(_rootDir);
    }
    if (info.keyPath){
        var items = info.keyPath.split('/');
        for (var i = 0; i < items.length; i++) {
            _rootDir = path.join(_rootDir, items[i]);
            if (!fs.existsSync(_rootDir)) {
                fs.mkdirSync(_rootDir);
            }
        }
    }
   
    _rootDir = path.join(_rootDir, path.basename(info.originFile));
    fs.writeFileSync(_rootDir, info.content);
    info.renderFile = _rootDir;
    map[req.getLanguage()][info.originFile] = _rootDir;
    
    if(info.extentInfo){
        info.extentInfo.keyPath = path.relative(
            "".getRootDir(context.app.dir, "views"),
            path.dirname(info.extentInfo.originFile)
        );
        _compile(context, req, info.extentInfo, model);
    }
    if(info.includeInfo){
        for(var i=0;i<info.includeInfo.length;i++){
            info.includeInfo[i].keyPath = path.relative(
                "".getRootDir(context.app.dir, "views"),
                path.dirname(info.includeInfo[i].originFile)
            );
            _compile(context, req, info.includeInfo[i], model);
        }
    }
    else {
        var c=1;
    }
    
}
function compiler(context,req,info,model,lockKey){
      
    
    var renderFile;
    if (map[req.getLanguage()] && map[req.getLanguage()][info.originFile]){
        info.renderFile = map[req.getLanguage()][info.originFile];
        
    }
    else {
        pageLockRuner(function(cb){
            try {
                _compile(context, req, info, model);
                // map[req.getLanguage()][info.originFile]=_rootDir;
                    cb(undefined, map[req.getLanguage()][info.originFile]);
            } catch (error) {
                cb(error);
            }
        },lockKey);
    }
    function render(cb){
        nunjucks.render(info.renderFile, model, function (ex, res) {
            cb(ex,res);
        });

    }
    if(require("../index").getIsCacheTemplate()){
        nunjucks.configure(
            "".getRootDir("temp", req.getLanguage(), context.app.name), 
            {
            watch: true,
            noCache: true,
            tags: {
                blockStart: '{%',
                blockEnd: '%}',
                variableStart: '{(',
                variableEnd: ')}',
                commentStart: '{#',
                commentEnd: '#}'
            }
        });
    }
    else {
        nunjucks.configure(
            "".getRootDir("temp", req.getLanguage(), context.app.name),
            {
                watch: true,
                noCache: false,
                tags: {
                    blockStart: '{%',
                    blockEnd: '%}',
                    variableStart: '{(',
                    variableEnd: ')}',
                    commentStart: '{#',
                    commentEnd: '#}'
                }
            });
    }
    
    var html = sync.sync(render,[]);
    return html;
}
module.exports={
    compiler:compiler,
    clearCache:function(){
        map={};
    }
};