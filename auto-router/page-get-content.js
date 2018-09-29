var key= "__${page-get-content}$__";
global[key]={};
var language=require("../q-language");
var pageLanguage=require("./page-language");
var fs=require('fs');
var path=require("path")
var pageGetContentServer=require("./page-get-server-script");
var pageResolveClientStaticScript=require("./page-resolve-client-static-script");
var pageServerFunctions=require("./page-server-functions");
var pageLockRunner=require("./page-lock-runner");
var chokidar = require('chokidar');
var watcher = chokidar.watch('file, dir, or glob', {
    ignored: /[\/\\]\./, persistent: true
  });
function applyLanguage(req,languageInfo,info,context){
    var ret=info;
    var keys=Object.keys(languageInfo.fullList||{});
            for(var i=0;i<keys.length;i++){
                var key=keys[i];
                var item=languageInfo.fullList[key];
                if(ret.script){
                    while(ret.script.indexOf('"'+key+'"')>-1){
                        if(item.level==1){
                            var val = language.getItem(
                                    req.getLanguage(),
                                    context.app.name,
                                    req.getViewPath(),
                                    key,
                                    item.value
                                );
                            ret.script = ret.script.replace('"' + key + '"','"'+val+'"');
                        }
                        if(item.level==2){
                            var val = language.getItem(
                                req.getLanguage(),
                                context.app.name,
                                "-",
                                key,
                                item.value
                            );
                            ret.script = ret.script.replace('"' + key + '"', '"' + val + '"');
                        }
                        if(item.level==3){
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
                while(ret.content.indexOf(key)>-1){
                    if(item.level==1){
                        var val = language.getItem(
                            req.getLanguage(),
                            context.app.name,
                            req.getViewPath(),
                            key,
                            item.value
                        );
                        ret.content = ret.content.replace(key, val);
                    }
                    if(item.level==2){
                        var val = language.getItem(
                            req.getLanguage(),
                            context.app.name,
                            "-",
                            key,
                            item.value
                        );
                        ret.content = ret.content.replace(key, val);
                    }
                    if(item.level==3){
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
            if(ret.script){
                // var i=ret.script.indexOf("{");
                // var end=ret.script.length-1;
                // while (end >= 0 && ret.script[end]!="}"){
                //     end--;
                // }
                // var script = ret.script.substring(i+1, end);
                ret.runner = eval(ret.script);
            }
    return ret;
}
function loadFile(req,res,file,context){
    if (global[key][req.getLanguage()] && global[key][req.getLanguage()][file]){
        return global[key][req.getLanguage()][file];
    }
    else {
        pageLockRunner(function(cb){
            try {
                var content=fs.readFileSync(file, "utf8");
                var languageInfo= pageLanguage.extractItems(content);
                var ret=pageGetContentServer(content);
                ret.content=pageResolveClientStaticScript(req,res,ret.content,context);
                ret.content=pageServerFunctions(req,res,ret.content,context);
                ret.resItems=languageInfo;
                
                ret.originFile=file;
                ret.fileName=path.basename(file);
                ret.dirName=file.substring(0,file.length-ret.fileName-1);
                ret.rootDir=path.dirname(require.main.filename);
                var dir=path.dirname(file);
                ret.relDir=ret.rootDir.substring(dir.length,ret.rootDir.length);
                ret.relFileName=ret.relDir+path.sep+ret.fileName;
                ret.viewPath=ret.rootDir+"/"+ret.fileName;
                req.setViewPath(ret.relFileName);
                ret = applyLanguage(req, languageInfo, ret, context);
                var lang=req.getLanguage();
                require('chokidar').watch(file,{}).on('change', function(path, stats) {
                    var pageCompiler=require("./page-compiler");
                    pageCompiler.clearCache();
                    delete global[key][lang][path];
                    if (stats) console.log('File', path, 'changed size to', stats.size);
                });
                if (!global[key][req.getLanguage()]){
                    global[key][req.getLanguage()] = {};
                }
                global[key][req.getLanguage()][file]=ret;
                cb(undefined,ret);
            } catch (error) {
                cb(error);
            }
        });
        
    }
    return global[key][req.getLanguage()][file];
}
function clearCacheFile(file){
    delete global[key][file]
}
module.exports ={
    loadFile:loadFile,
    clearCacheFile:clearCacheFile
}