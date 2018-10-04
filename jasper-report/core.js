var request = require("request");
var sync=require("./sync");
function Jasper(url,username,password){
    this.username=username;
    this.password=password;
    this.url=url;
    this.users=new Users(this);
    this.roles=new Roles(this);
    
};
Jasper.prototype.__getAuth=function(){
    return {
        'user':this.username ,
        'pass':this.password,
        'sendImmediately': false
    }
}

function Users(owner){
    this.owner=owner;
}

Users.prototype.find=function(txtSearch, cb){
    var me=this;
    function run(cb){
        try {
            request.get({
                url:me.owner.url+((!txtSearch)? "/rest_v2/users": ("/rest_v2/users?search="+encodeURI(txtSearch))),
                'auth': me.owner.__getAuth(),
                json: true,
              },function(ex,res){
                  if(ex){
                      cb(ex)
                  }
                  else {
                      cb(null,res.body);
                  }
              });
        } catch (error) {
                cb(error);
        }
    };
    if(cb) run(cb);
    else {
        return sync.sync(run,[]);
    }
};
Users.prototype.get=function(userId, cb){
    var me=this;
    function run(cb){
        try {
            request.get({
                url:me.owner.url+"/rest_v2/users/"+userId,
                'auth': me.owner.__getAuth(),
                json: true,
              },function(ex,res){
                  if(ex){
                      cb(ex)
                  }
                  else {
                      cb(null,res.body);
                  }
              });
        } catch (error) {
                cb(error);
        }
    };
    if(cb) run(cb);
    else {
        return sync.sync(run,[]);
    }
};
Users.prototype.createOrModify=function(userInfo,cb){
    
    var me=this;
    var userId=userInfo.username;
    var postData={};
    var keys=Object.keys(userInfo);
    keys.forEach(function(key,index){
         postData[key]=userInfo[key];
    });
    /**
     * "fullName":"Joe User",
  "emailAddress":"juser@example.com",
  "enabled":false,
  "password":"mySecretPassword",
  "roles":[
    {"name":"ROLE_MANAGER"}]
     * @param {*} cb 
     */
    function run(cb){
        try {
            if(!userInfo.fullName){
                throw(new Error("fullName is missing"));
            }
            if(!userInfo.emailAddress){
                throw(new Error("emailAddress is missing"));
            }
            if(!userInfo.roles){
                throw(new Error("roles is missing"));
            }
            userInfo.enabled=(userInfo.enabled===true);

            request.put({
                url:me.owner.url+"/rest_v2/users/"+userId,
                'auth': me.owner.__getAuth(),
                json: true,
                headers:{
                    "content-type": "application/json"
                },
                body:postData
              },function(ex,res){
                  if(ex){
                      cb(ex)
                  }
                  else {
                      cb(null,res.body);
                  }
              });
        } catch (error) {
                cb(error);
        }
    };
    if(cb) run(cb);
    else {
        return sync.sync(run,[]);
    }
}
function Roles(owner){
    this.owner=owner;
}
Roles.prototype.find=function(txtSearch, cb){
    var me=this;
    function run(cb){
        try {
            request.get({
                url:me.owner.url+((!txtSearch)? "/rest_v2/roles": ("/rest_v2/roles?search="+encodeURI(txtSearch))),
                'auth': me.owner.__getAuth(),
                json: true,
              },function(ex,res){
                  if(ex){
                      cb(ex)
                  }
                  else {
                      cb(null,res.body);
                  }
              });
        } catch (error) {
                cb(error);
        }
    };
    if(cb) run(cb);
    else {
        return sync.sync(run,[]);
    }
};
module.exports=Jasper;