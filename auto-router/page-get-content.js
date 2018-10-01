var key= "__${page-get-content}$__";
global[key]={};
var language=require("../q-language");
var pageLanguage=require("./page-language");
var pageLoader=require("./page-loader");
var fs=require('fs');
var path=require("path");
var pageNunjucksExtent=require("./page-nunjucks-extent");
var pageGetContentServer=require("./page-get-server-script");
var pageResolveClientStaticScript=require("./page-resolve-client-static-script");
var pageServerFunctions=require("./page-server-functions");
var pageLockRunner=require("./page-lock-runner");
var pageAjax=require("./page-ajax");
var chokidar = require('chokidar');
var wacthCache={};
var path = require("path");

function loadFile(req,res,file,context,lockKey){
    if (global[key][req.getLanguage()] && global[key][req.getLanguage()][file]){
        return global[key][req.getLanguage()][file];
    }
    else {
        pageLockRunner(function(cb){
            try {
                var ret = pageLoader(req, res, file, context);
                if (!global[key][req.getLanguage()]) {
                    global[key][req.getLanguage()] = {};
                }
                global[key][req.getLanguage()][file] = ret;
                cb();
            } catch (error) {
                cb(error);
            }
            
        },lockKey);
        
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