require("./q-extension");
var _isTemplateCache=true;
function setIsCacheTemplate(val){
    _isTemplateCache=val;
}
function getIsCacheTemplate(val) {
    return _isTemplateCache;
}
var cnn = undefined;
function setConnect(url) {
    cnn = require("mongoose").createConnection(url);
    return cnn;
}
function getConnect() {
    return cnn;
}
module.exports={
    setIsCacheTemplate: setIsCacheTemplate,
    getIsCacheTemplate: getIsCacheTemplate,
    apps:require("./q-apps"),
    func_define:require("./q-func-define"),
    json:require("./q-json"),
    language:require("./q-language"),
    logger:require("./q-logger"),
    model_define:require("./q-model-define"),
    sync:require("./q-sync"),
    view_define:require("./q-view"),
    controller: require("./q-controller"),
    setRootDir: function(path) {
        global.__rootDir = path;
    },
    getRootDir: function(){
        return global.__rootDir;
    },
    setConnect: setConnect,
    getConnect: getConnect
}
