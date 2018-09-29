var langauge=require("../q-language");
function trim(key){
    while (key[0] === " ") {
        key = key.substring(1, key.length);
    }
    while (key[key.length - 1] === " ") {
        key = key.substring(0, key.length - 1);
    }
    while (key.indexOf("  ") > -1) {
        key = key.replace("  ", " ");
    }
    return key;
}
function replace(txt,key){
    while(txt.indexOf(key)>-1){
        txt=txt.replace(key,"");
    }
    return txt;
}
function extractItems(content){
    var reg = /res:\(([^()]+)\)/;
    var appReg = /res::\(([^()]+)\)/;
    var globalReg = /res:::\(([^()]+)\)/;
    var originalContent = content;
    var content = content;
    var ret = reg.exec(content);
    var list = [];
    var checkList={};
    var fullList=[];
    while (ret !== null) {
        var key = trim(ret[1]);
        
        key = escape(key.toLowerCase());

        if(!checkList[ret[0]]){
            checkList[ret[0]]={
                full: ret[0],
                value: ret[1],
                key: key,
                index: ret.index,
                level:1
            };
            list.push(checkList[ret[0]]);
        }

        content=replace(content,ret[0]);
        // content = content.substring(ret.index + ret[0].length, content.length);
        ret = reg.exec(content);
    }
    var pageItems= list;
    list = [];
    ret = appReg.exec(content);
    while (ret !== null) {
        var key = trim(ret[1]);
        key = escape(key.toLowerCase());
        if(!checkList[ret[0]]){
            checkList[ret[0]]={
                full: ret[0],
                value: ret[1],
                key: key,
                index: ret.index,
                level:2
            };
            list.push(checkList[ret[0]]);
        }
        
        content = replace(content,ret[0]);
        ret = appReg.exec(content);
    }
    var appItems=list;
    list = [];
    ret = globalReg.exec(content);
    while (ret !== null) {
        var key = trim(ret[1]);
        key = escape(key.toLowerCase());
        if(!checkList[ret[0]]){
            checkList[ret[0]]={
                full: ret[0],
                value: ret[1],
                key: key,
                index: ret.index,
                level:3
            };
            list.push(checkList[ret[0]]);
        }

        content = replace(content,ret[0]);
        ret = globalReg.exec(content);
    }
    var globalItems= list;
    return {
        items:pageItems,
        appItems:appItems,
        globalItems:globalItems,
        fullList:checkList
    }
}
function syncLanguage(info){
    var x=info;
}
module.exports={
    extractItems:extractItems,
    syncLanguage: syncLanguage
};