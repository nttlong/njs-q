function getServerScript(content){
    var startReg = /\<script\s+server\>/;
    var endReg = '</script>';
    var m = startReg.exec(content);
    if (m) {
        var s1 = content.indexOf('>', m.index) + 1;
        var s2 = content.indexOf(endReg, s1);
        var script = content.substring(s1, s2);
        content = content.substring(0, m.index) +
            content.substring(s2 + endReg.length, content.length);
        while (content.charCodeAt(0)==10){
            content=content.substring(1,content.length);
        }
        while (content.charCodeAt(content.length-1)==10){
            content=content.substring(0,content.length-1);
        }
        while (content[0]==" "){
            content=content.substring(1,content.length);
        }
        while (content[content.length-1]==" "){
            content=content.substring(0,content.length-1);
        }
        return {
            content: content,
            script: script
        }
        return ret;
    }
    else {
        return {
            content: content
        };
    }
};
module.exports=getServerScript