var q = require("../index");
var app = q.apps;
app.setSecretKey("sas03udh74327%$63283");
app.setCacheMode(true);
app.setCompressMode(false);
app.sessionCacheUseMemCache(true);
app.sessionCacheUseMemCache(false);
app.load(
    {
        name:"test",
        hostDir:"",
        dir:"apps/test",
        isAutoRoute:true
    }
).listen(3000,function(){
    console.log("app start  at port 3000");
});