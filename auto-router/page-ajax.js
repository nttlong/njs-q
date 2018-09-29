require("../q-extension");
var lock=require("./page-lock-runner");
var uuid=require("uuid");
var sync=require("../q-sync");
var path= require("path");
var fs=require("fs");
var cache={
    data:{},
    revert:{}
};

var cacheDir = "".getRootDir("data","cache","api");
function getCacheDir(){
    return cacheDir;
}
function getApiKey(appName,apiPath){
    if(cache.data[apiPath]){
        return cache.data[apiPath];
    }
    else {
        try {
            var dir = path.sep.join(cacheDir, appName);
            if (!fs.existsSync("".getRootDir("data"))) {
                fs.mkdirSync("".getRootDir("data"));
            }
            if (!fs.existsSync("".getRootDir("data","cache"))) {
                fs.mkdirSync("".getRootDir("data", "cache"));
            }
            if (!fs.existsSync("".getRootDir("data", "cache", "api"))) {
                fs.mkdirSync("".getRootDir("data", "cache", "api"));
            }
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir);
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var file = path.sep.join(dir, "data.json");
            if (!fs.existsSync(file)) {
                var key = uuid.v4();
                cache.data[apiPath] = key;
                cache.revert[key] = apiPath;
                fs.writeFileSync(file, JSON.stringify(cache), 'utf8');
            }
            else {
                var txt = fs.readFileSync(file);
                cache = JSON.parse(txt);
                if (!cache.data[apiPath]) {
                    var key = uuid.v4();
                    cache.data[apiPath] = key;
                    cache.revert[key] = apiPath;
                    fs.writeFileSync(file, JSON.stringify(cache), 'utf8');
                }
            }
           // cb(null, cache);
        } catch (error) {
            throw(error);
        }
    }
    return cache.data[apiPath];
}
function getApiPath(appName,key){
    if(cache.revert[key]){
        return cache.revert[key];
    }
    else {
        var dir = path.sep.join(cacheDir, appName);
        var file = path.sep.join(dir, "data.json");
        var txt = fs.readFileSync(file);
        cache = JSON.parse(txt);
        if (! cache.revert[key]){
            throw(Error("'"+key+"' was not found"))
        }
        return cache.revert[key];
    }
}
function commileApiClient(req, res, content, context) {
    var regEx = /\"page:\/\/api\/.*\"/;
    var subRegEx = /\/.*\//;
    var m = regEx.exec(content);
    context.info.ajaxKeys=[];
    context.info.ajax={};
    while (m) {
        var n = subRegEx.exec(m[0]);
        if (n) {
            var apiPath=n[0];
            var key = getApiKey(context.app.name,apiPath);
            context.info.ajaxKeys.push(key);
            while (content.indexOf(m[0]) > -1) {
                content = content.replace(m[0],"callback('"+ key+"')");
            }
            context.info.ajax[key]=getApiPath(context.app.name,key);
            
        }
        m = regEx.exec(content);
    }
    return content;

}
module.exports={
    getApiKey: getApiKey,
    getApiPath: getApiPath,
    commileApiClient: commileApiClient
};