var request = require("request");
var Users=require("./users");
var Roles=require("./roles");
var Reports=require("./Reports");
var sync=require("./sync");
function Jasper(url,username,password){
    this.username=username;
    this.password=password;
    this.url=url;
    this.users=new Users(this);
    this.roles=new Roles(this);
    this.reports =new Reports(this);
    
};
Jasper.prototype.__getAuth=function(){
    return {
        'user':this.username ,
        'pass':this.password,
        'sendImmediately': false
    }
}



module.exports=Jasper;