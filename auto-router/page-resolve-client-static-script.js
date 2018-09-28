function getStaticScript(req,res,content,context){
    var startReg = /\<script\s+src\=\".*\"\s+static\><\/script\>/;
    var subReg=/src\=\".*\"/;
    var endReg = '</script>';
    var m = startReg.exec(content);
    while (m) {
        var n=subReg.exec(m[0]);
        if(n){
            var str=n[0].split('"')[1];
            var x=str.lastIndexOf("../static/");
            x=x+"../static/".length;
            var src=req.getAppUrl()+"/static/"+str.substring(x,str.length);
            content=content.replace(m[0],'<script src="'+src+'"></script>');
        }
        m = startReg.exec(content);
    }
    var removeReg = /\<script\s+src\=\".*\"\s+remove\><\/script\>/;
    m = removeReg.exec(content);
    while (m) {
        content=content.replace(m[0],"");
        m = removeReg.exec(content);
    }
    return content;
};
module.exports=getStaticScript