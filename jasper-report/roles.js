var sync=require("./sync");
var request=require("request");
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
module.exports=Roles