function getExtentPageList(content){
    var regEx = /\{%(\s+extends|extends)\s+\".*(\"(\s+)|\")\%}/;
    var subRegEx = /\".*\"/;
    var m=regEx.exec(content);
    if(m){
        var ret = subRegEx.exec(m[0])[0];
        return ret.substring(1,ret.length-1);
    }
}
module.exports={
    getExtends: getExtentPageList
}