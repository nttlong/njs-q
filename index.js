var _isTemplateCache=true;
function setIsCacheTemplate(val){
    _isTemplateCache=val;
}
function getIsCacheTemplate(val) {
    return _isTemplateCache;
}
module.exports={
    setIsCacheTemplate: setIsCacheTemplate,
    getIsCacheTemplate: getIsCacheTemplate,
    api:require("./q-api"),
    apps:require("./q-apps"),
    datetime:require("./q-date-time"),
    email:require("./q-email"),
    forms:require("./q-forms"),
    func_define:require("./q-func-define"),
    json:require("./q-json"),
    language:require("./q-language"),
    logger:require("./q-logger"),
    model_define:require("./q-model-define"),
    mongo:require("./q-mongo"),
    sync:require("./q-sync"),
    sys:require("./q-system"),
    textFornat:require("./q-text-format"),
    view_define:require("./q-view"),
    controller: require("./q-controller"),
    setRootDir: function(path) {
        global.__rootDir = path;
    },
    getRootDir: function(){
        return global.__rootDir;
    }
}