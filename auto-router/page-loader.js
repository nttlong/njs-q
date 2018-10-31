require("../q-extension");
var key = "__${page-get-content}$__";

var language = require("../q-language");
var pageLanguage =require("./page-language");
var pageNunjucksExtent=require("./page-nunjucks-extent");
var pageNunjucksInclude=require("./page-nunjucks-include");
var fs = require("fs");
var pageGetContentServer = require("./page-get-server-script");
var pageGetContentServerWithSrc = require("./page-get-server-script-with-src");
var pageResolveClientStaticScript = require("./page-resolve-client-static-script");
var pageServerFunctions = require("./page-server-functions");
var pageLockRunner = require("./page-lock-runner");
var pageAjax = require("./page-ajax");
var chokidar = require('chokidar');
var wacthCache = {};
var path = require("path");
var watcher = chokidar.watch('file, dir, or glob', {
    ignored: /[\/\\]\./, persistent: true
});
function applyLanguage(req, languageInfo, info, context) {
    var ret = info;
    var keys = Object.keys(languageInfo.fullList || {});
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var item = languageInfo.fullList[key];
        if (ret.script) {
            while (ret.script.indexOf('"' + key + '"') > -1) {
                if (item.level == 1) {
                    var val = language.getItem(
                        req.getLanguage(),
                        context.app.name,
                        req.getViewPath(),
                        key,
                        item.value
                    );
                    ret.script = ret.script.replace('"' + key + '"', '"' + val + '"');
                }
                if (item.level == 2) {
                    var val = language.getItem(
                        req.getLanguage(),
                        context.app.name,
                        "-",
                        key,
                        item.value
                    );
                    ret.script = ret.script.replace('"' + key + '"', '"' + val + '"');
                }
                if (item.level == 3) {
                    var val = language.getItem(
                        req.getLanguage(),
                        "-",
                        "-",
                        key,
                        item.value
                    );
                    ret.script = ret.script.replace('"' + key + '"', '"' + val + '"');
                }
            }
        }
        while (ret.content.indexOf(key) > -1) {
            if (item.level == 1) {
                var val = language.getItem(
                    req.getLanguage(),
                    context.app.name,
                    req.getViewPath(),
                    key,
                    item.value
                );
                ret.content = ret.content.replace(key, val);
            }
            if (item.level == 2) {
                var val = language.getItem(
                    req.getLanguage(),
                    context.app.name,
                    "-",
                    key,
                    item.value
                );
                ret.content = ret.content.replace(key, val);
            }
            if (item.level == 3) {
                var val = language.getItem(
                    req.getLanguage(),
                    "-",
                    "-",
                    key,
                    item.value
                );
                ret.content = ret.content.replace(key, val);
            }
        }
    }
    if (ret.script) {
        ret.runner = eval(ret.script);
    }
    else if(ret.scriptPath){
        ret.runner =require(ret.scriptPath);
    }
    return ret;
}
function loadFile(req, res, file, context) {
    var content = fs.readFileSync(file, "utf8");
    var extendFile = pageNunjucksExtent.getExtends(content);
    var includeFiles=pageNunjucksInclude.getIncludes(content);

    var languageInfo = pageLanguage.extractItems(content);
    var ret = pageGetContentServer(languageInfo.content);
    var retSrc=pageGetContentServerWithSrc(file,languageInfo.content);
    ret.content =retSrc.content;
    if(retSrc.scriptPath){
        ret.scriptPath=retSrc.scriptPath;
    }
    ret.content = pageResolveClientStaticScript(req, res, ret.content, context);
    ret.content = pageServerFunctions(req, res, ret.content, context);
    ret.content = pageAjax.commileApiClient(req, res, ret.content, context);
    ret.resItems = languageInfo;
    if(extendFile){
        ret.extentInfo  = loadFile(
                req,
                res,
            path.join("".getRootDir(context.app.dir, "views"), extendFile), context);
            var test=1;
    }
    ret.includeInfo=[];
    for(var i=0;i<includeFiles.length;i++){
       
        ret.includeInfo.push(loadFile(
            req,
            res,
            path.join("".getRootDir(context.app.dir, "views"), includeFiles[i]), context)
        )
    }
    ret.originFile = file;
    ret.fileName = path.basename(file);
    ret.dirName = file.substring(0, file.length - ret.fileName - 1);
    ret.rootDir = path.dirname(require.main.filename);
    var dir = path.dirname(file);
    ret.relDir = ret.rootDir.substring(dir.length, ret.rootDir.length);
    ret.relFileName = ret.relDir + path.sep + ret.fileName;
    ret.viewPath = ret.rootDir + "/" + ret.fileName;
    req.setViewPath(ret.relFileName);
    ret = applyLanguage(req, languageInfo, ret, context);
    var lang = req.getLanguage();
    if(ret.scriptPath){
        if (!wacthCache[ret.scriptPath]) {
            require('chokidar').watch(ret.scriptPath, {}).on('change', function (path, stats) {
                delete require.cache[path];
                ret.runner =require(ret.scriptPath);
                var pageCompiler = require("./page-compiler");
                pageCompiler.clearCache();
                global[key][lang]={};
                if (stats) console.log('File', path, 'changed size to', stats.size);
            });
            wacthCache[file] = file;
        }
    }
    if (!wacthCache[file]) {
        require('chokidar').watch(file, {}).on('change', function (path, stats) {
            var pageCompiler = require("./page-compiler");
            pageCompiler.clearCache();
            global[key][lang]={};
            if (stats) console.log('File', path, 'changed size to', stats.size);
        });
        wacthCache[file] = file;
    }
    return ret;


}
module.exports=loadFile; 