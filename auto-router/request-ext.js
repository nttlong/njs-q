//var api=require("../q-api");
var tenancy=require("../q-apps/tenancy");
var sync=require("../q-sync");
var path=require("path");
var ECT = require('ect');
var LANGUAGE=require("../q-language");
var caching={};
var session_caching={}
var logger=require("../q-logger")(__filename);
var sessionCache=require("../q-apps/session-cache");
var chokidar=require("chokidar")
var cacheWatch={};
function wacth_module(moduleFullPath) {
    if(!cacheWatch[moduleFullPath]){
        chokidar.watch(
            moduleFullPath,
                {
                    ignoreInitial: true, 
                    ignored: /^\./, 
                    persistent: true
                }
            ).on('add',function(path){
                delete require.cache[path];
            }).on('change',function(path){
                delete require.cache[path];
            });
            cacheWatch[moduleFullPath]=moduleFullPath;
    }
}
function apply(context,model,req,res){
    
    if (!req.__abs_url__) {

        var requrl = req.protocol + "://" + req.get('host');
        req.__abs_url__ = requrl;
    }
    var getAbsUrl = function () {

        return req.__abs_url__;
    };
    var getAppUrl = function (file) {
        
        if (context.app.hostDir) {
            if (req.tenancyCode) {
                return getAbsUrl() + "/" + req.tenancyCode + "/" + context.app.hostDir + (file ? ("/" + file) : "");
            }
            else {
                return getAbsUrl() + "/" + context.app.hostDir + (file ? ("/" + file) : "");
            }

        }
        else {
            if (req.tenancyCode) {
                return getAbsUrl() + "/" + req.tenancyCode + (file ? ("/" + file) : "");
            }
            else {
                return getAbsUrl() + (file ? ("/" + file) : "");
            }
        }
    };
    var getAppStatic = function (file) {
        if (context.tenancyCode) {
            if (context.app.hostDir) {
                return getAbsUrl() + "/" + req.tenancyCode + "/" + context.app.hostDir + "/static/" + file;
            }
            else {
                return getAbsUrl() + "/" + req.tenancyCode + "/static/" + file;
            }
        }
        else {
            if (context.app.hostDir) {
                return getAbsUrl() + "/" + context.app.hostDir + "/static/" + file;
            }
            else {
                return getAbsUrl() + "/static/" + file;
            }
        }
    };
    var getLanguage = function () {
        return "en";
    };
    var getGlobalRes = function (key, value) {
        return LANGUAGE.getItem(getLanguage(), "-", "-", key, value);
    };
    var getAppRes = function (key, value) {
        return LANGUAGE.getItem(getLanguage(), context.app.name, "-", key, value);
    };
    var getRes = function (key, value) {
        return LANGUAGE.getItem(getLanguage(), context.app.name, owner.fileName, key, value);
    };
    var getCurrentUrl = function () {
        var _url = req.url.split('?')[0];
        return req.getAppUrl(_url.substring(1, _url.length))
    };
    var setUser = function (user) {
        var key = req.sessionID + "://user";
        if (sessionCache.getIsUseMemCache()) {
            sessionCache.sessionCacheSet(key, user);
        }
        else {
            session_caching[key] = user;
        }
        // req.__user__=user;
    };
    var getUser = function () {
        var key = req.sessionID + "://user";
        if (sessionCache.getIsUseMemCache()) {
            return sessionCache.sessionCacheGet(key);
        }
        else {
            return session_caching[key];
        }
    };
    var escapeUrl = function (url) {
        return encodeURIComponent(escape(url));
    };
    var unescapeUrl = function (url) {
        return unescape(decodeURIComponent(url));
    };
    var getViewPath = function () {
        return req.__viewPath || context.info.relFileName;
    };
    var setViewPath = function (path) {
        req.__viewPath = path;
    };
    var loadModule = function (path) {
        if (path.substring(0, 2) == "./") {
            var moduleFullPath="".getRootDir(path.substring(2,path.length));
            var PATH = require("path")
            var ret= require(moduleFullPath);
            wacth_module(moduleFullPath);
            
            return ret;
            
        }
        else if (path.substring(0, 2) == "~/") {
            var PATH = require("path");
            var moduleFullPath="".getRootDir(context.app.dir, path.substring(2,path.length));
            var ret= require(moduleFullPath);
            wacth_module(moduleFullPath);
            return ret;
        }
        else {
            var ret= require(path);
            wacth_module(path);
            return ret;
        }
    };
    var getApi = function (path) {
        return api.getKey(context.app.hostDir + "@" + path)
    };
    var getFullUrl = function () {
        return req.getAbsUrl() + req.url;
    };
    var redirect=function(url){
        res.redirect(url)
    }
    var getApp=function(){
        return context.app
    }
    var loadHtml=function(file){
        var pageLoaderHtml=require("./page-loader-html");
        var ret=pageLoaderHtml.loadHtml(context.app.name, req.getLanguage(), "".getRootDir(
            context.app.dir,"views",file 
        ))
        var retHtml= pageLoaderHtml.compile(context,ret,req,res);
        return retHtml;
    }
    var loadFile=function(file){
        var path=require("path");
        var p=require("./page-get-content");
        var executor=require("./executor");
        var compile=require("./page-compiler");
        var c=context;
        var fullFile="".getRootDir(context.app.dir,"views",file);
        var renderInfo={
            info:{
                ajax:{},
                ajaxKeys:[],
                dirName:"",
                extentInfo:undefined,
                file:file,
                relDir:"",
                relFileName:"",
                rootDir:"".getRootDir(),
                url:context.url,
                originFile:fullFile
            },
            app:context.app
        };
        var ret=p.loadFile(req,res,fullFile,renderInfo,fullFile);
        var retModel={};
        executor.execCode([ret],retModel,req,res);
        var txt=compile.compiler(renderInfo,req,{
            originFile:fullFile,
            keyPath:path.dirname(file)
        },retModel,fullFile);

        return txt;
    }
    var fnList=[
        getAbsUrl,
        getAbsUrl,
        getApi,
        getAppRes,
        getAppStatic,
        getAppUrl,
        getCurrentUrl,
        getFullUrl,
        getGlobalRes,
        getLanguage,
        getRes,
        getUser,
        getViewPath,
        setUser,
        setViewPath,
        loadModule,
        redirect,
        getApp,
        // loadFile,
        loadHtml
    ];
    for(var i=0;i<fnList.length;i++){
        model[fnList[i].name] = fnList[i];
        req[fnList[i].name] = fnList[i];
    }
}
module.exports=apply