function apply(owner,model,req,res){
    if (!req.__abs_url__) {

        var requrl = req.protocol + "://" + req.get('host');
        req.__abs_url__ = requrl;
    }
    var getAbsUrl = function () {

        return req.__abs_url__;
    };
    var getAppUrl = function (file) {
        if (me.app.hostDir) {
            if (req.tenancyCode) {
                return getAbsUrl() + "/" + req.tenancyCode + "/" + me.app.hostDir + (file ? ("/" + file) : "");
            }
            else {
                return getAbsUrl() + "/" + me.app.hostDir + (file ? ("/" + file) : "");
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
        if (req.tenancyCode) {
            if (me.app.hostDir) {
                return getAbsUrl() + "/" + req.tenancyCode + "/" + me.app.hostDir + "/static/" + file;
            }
            else {
                return getAbsUrl() + "/" + req.tenancyCode + "/static/" + file;
            }
        }
        else {
            if (me.app.hostDir) {
                return getAbsUrl() + "/" + me.app.hostDir + "/static/" + file;
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
        return LANGUAGE.getItem(getLanguage(), me.app.name, "-", key, value);
    };
    var getRes = function (key, value) {
        return LANGUAGE.getItem(getLanguage(), me.app.name, owner.fileName, key, value);
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
        return req.__viewPath || owner.fileName
    };
    var setViewPath = function (path) {
        req.__viewPath = path;
    };
    var loadModule = function (path) {
        if (path.substring(0, 2) == "./") {
            var PATH = require("path")
            return require(PATH.parse(require.main.filename).dir + "/" + path);
        }
        else {
            return require(path);
        }
    };
    var getApi = function (path) {
        return api.getKey(me.app.hostDir + "@" + path)
    };
    var getFullUrl = function () {
        return req.getAppUrl(req.url.substring(1, req.url.length))
    };
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
        setViewPath
    ];
    for(var i=0;i<fnList.length;i++){
        model[fnList[i].name] = fnList[i];
        req[fnList[i].name] = fnList[i];
    }
}
module.exports=apply