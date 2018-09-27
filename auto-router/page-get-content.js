var key= "__${page-get-content}$__";
global[key]={};
var pageLanguage=require("./page-language");
var fs=require('fs');
var pageGetContentServer=require("./page-get-server-script");
var pageLockRunner=require("./page-lock-runner");
var chokidar = require('chokidar');
var watcher = chokidar.watch('file, dir, or glob', {
    ignored: /[\/\\]\./, persistent: true
  });
function applyLanguage(languageInfo,info){
    var ret=info;
    var keys=Object.keys(languageInfo.fullList||{});
            for(var i=0;i<keys.length;i++){
                var key=keys[i];
                var item=languageInfo.fullList[key];
                if(ret.script){
                    while(ret.script.indexOf('"'+key+'"')>-1){
                        if(item.level==1){
                            ret.script=ret.script.replace('"'+key+'"','context.getRes("'+item.key+'")');
                        }
                        if(item.level==2){
                            ret.script=ret.script.replace('"'+key+'"','context.getAppRes("'+item.key+'")');
                        }
                        if(item.level==3){
                            ret.script=ret.script.replace('"'+key+'"','context.getGlobalRes("'+item.key+'")');
                        }
                    }
                }
                while(ret.content.indexOf(key)>-1){
                    if(item.level==1){
                        ret.content=ret.content.replace(key,'<%- @getRes("'+item.key+'") %>');
                    }
                    if(item.level==2){
                        ret.content=ret.content.replace(key,'<%- @getAppRes("'+item.key+'") %>');
                    }
                    if(item.level==3){
                        ret.content=ret.content.replace(key,'<%- @getGlobalRes("'+item.key+'") %>');
                    }
                }
            }    
            if(ret.script){
                var i=ret.script.indexOf("{")
                var script=ret.script.substring(i,ret.script.length)
                ret.runner=eval("(function(context,req,res,next)"+ script+")")
            }
    return ret;
}
function loadFile(file){
    if(global[key][file]){
        return global[key][file];
    }
    else {
        pageLockRunner(function(cb){
            try {
                var content=fs.readFileSync(file, "utf8");
                var languageInfo= pageLanguage.extractItems(content);
                var ret=pageGetContentServer(content);
                ret =applyLanguage(languageInfo,ret);
                
                
                ret.originFile=file;
                require('chokidar').watch(file,{}).on('change', function(path, stats) {
                    var pageCompiler=require("./page-compiler");
                    pageCompiler.clearCache();
                    delete global[key][path];
                    if (stats) console.log('File', path, 'changed size to', stats.size);
                });
                global[key][file]=ret;
                cb(undefined,ret);
            } catch (error) {
                cb(error);
            }
           
        });
        
    }
    return global[key][file];
}
function clearCacheFile(file){
    delete global[key][file]
}
module.exports ={
    loadFile:loadFile,
    clearCacheFile:clearCacheFile
}