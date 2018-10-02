require("../q-extension")
var lock=require("./page-lock-runner");

var pageGetContentServer=require("./page-get-server-script");
var nunjucks = require( 'nunjucks' ) ;
var pageLanguage=require("./page-language");
var qLanguage=require("../q-language");
var cache={}
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
                if(ret.script){
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
        info.fn(model,req,res,next);
    }
    return nunjucks.renderString(info.content,model);
}
module.exports={
    loadHtml:loadHtml,
    compile:compile
}