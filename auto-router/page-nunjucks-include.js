function getIncludePageList(content){
    var retFiles=[];
    var regEx = /\{%(\s+include|include)\s+\".*(\"(\s+)|\")\%}/;
    var subRegEx = /\".*\"/;
    var _content=content;
    var m=regEx.exec(_content);
    while(m){
        var ret = subRegEx.exec(m[0])[0];
        ret=ret.substring(1,ret.length-1);
        while(_content.indexOf(m[0])>-1){
            _content=_content.replace(m[0],"");
        }
        m=regEx.exec(_content);
        retFiles.push(ret);

    }
    return retFiles;
}
module.exports={
    getIncludes: getIncludePageList
}