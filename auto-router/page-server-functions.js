function run(req,res,content,context){
    var regEx=/server:\/\/func\(.*\)/;
    var subRegEx=/\(.*\)/;
    var m=regEx.exec(content);
    while(m){
        var n=subRegEx.exec(m[0]);
        if(n){
            var items=n[0].split('(')[1].split(')')[0].split('.');
            var txt='{{'+items[0]+"("+",";
            for(var i=1;i<items.length;i++){
                txt+=items[i]+",";
            }
            txt=txt.substring(0,txt.length-1)+")}}";
            while(content.indexOf(m[0])>-1){
                content=content.replace(m[0],txt);
            }
        }
        m=regEx.exec(content);
    }
    return content;

}
module.exports=run;