var path=require("path")
String.prototype.replaceAll=function(val,replaceVal){
    var ret="";
    var i=0;
    while(i<this.length){
        if(this.substr(i,val.length)===val){
            ret+=replaceVal;
        }
        else {
            ret+=this.substr(i,val.length);
        }
        i+=val.length;
    }
    
    return ret;
}
String.prototype.join=function(){
    var ret="";
    for(var i=0;i<arguments.length;i++){
        ret+=arguments[i]+this;
    }
    return ret.substring(0,ret.length-this.length);
};
String.prototype.toPath=function(){
    var ret=this;
    ret=ret.replaceAll("/",path.sep).replaceAll("\\",path.sep);
    return ret;
};
String.prototype.getRootDir=function(){
    var path=require("path");
    var ret= path.dirname(require.main.filename);
    for(var i=0;i<arguments.length;i++){
        ret += path.sep + arguments[i];
    }
    return ret;
};