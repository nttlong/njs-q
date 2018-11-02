require("../q-extension")
var lock=require("./page-lock-runner");

var pageGetContentServer=require("./page-get-server-script");
var nunjucks = require( 'nunjucks' ) ;
var pageLanguage=require("./page-language");
var qLanguage=require("../q-language");
var pageGetContentServerWithSrc=require("./page-get-server-script-with-src");
var cache={}
var wacthCache={};
function loadHtml(appName,language,file){
    if(cache[language] && cache[language][file]){
        return cache[language][file];
    }
    else {
        lock(function(cb){
            try {
                if(!cache[language]){
                    cache[language]={};
                }
                var fs=require("fs");
                var txt=fs.readFileSync(file,"utf-8");
                var info= pageLanguage.extractItems(txt);
                
                var ret=pageGetContentServer(info.content);
                var retSrc=pageGetContentServerWithSrc(file,info.content);
                ret.content =retSrc.content;
                if(retSrc.scriptPath){
                    ret.scriptPath=retSrc.scriptPath;
                }
                if(ret.scriptPath){
                    ret.fn = require(ret.scriptPath);

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
                else if(ret.script){
                    ret.fn=eval(ret.script);
                }
                require('chokidar').watch(file, {}).on('change', function (path, stats) {
                    delete cache[language][file]
                    if (stats) console.log('File', path, 'changed size to', stats.size);
                });
                var keys=Object.keys(info.fullList);
                for(var i=0;i<keys.length;i++){
                    var key=keys[i];
                    var item=info.fullList[key];
                    if(item.level===1){
                        var resVal= qLanguage.getItem(language,appName,file,item.key,item.value);
                        while(ret.content.indexOf(item.full)>-1){
                            ret.content=ret.content.replace(item.full,resVal);
                        }
                    }
                    if(item.level===2){
                        var resVal= qLanguage.getItem(language,appName,"-",item.key,item.value);
                        while(ret.content.indexOf(item.full)>-1){
                            ret.content=ret.content.replace(item.full,resVal);
                        }
                    }
                    if(item.level===3){
                        var resVal= qLanguage.getItem(language,"-","-",item.key,item.value);
                        while(ret.content.indexOf(item.full)>-1){
                            ret.content=ret.content.replace(item.full,resVal);
                        }
                    }
                }
                cache[language][file]=ret;
                cb()  ;
            } catch (error) {
                cb(error);
            }
            
        },file)
    }
    return cache[language][file];
}
function compile(context,info,req,res,next){
    var model={};
    nunjucks.configure(
        "".getRootDir("apps", context.app.name,"views"), 
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
    if(info.fn){
        var ret=info.fn(model,req,res,next);
        if(req.header("AJAX-POST")){
            if(ret.ajax && ret.ajax[req.header("AJAX-POST")]){
                var resData=ret.ajax[req.header("AJAX-POST")](req.postData)||{};
                res.end(JSON.stringify(resData));
                
            }
        }
    }
    if(!res.headersSent){
        return nunjucks.renderString(info.content,model);
    }
    else {
        return undefined;
    }
    
}
module.exports={
    loadHtml:loadHtml,
    compile:compile
}