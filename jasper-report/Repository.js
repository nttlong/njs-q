var sync=require("./sync");
var request=require("request");
function Repository(owner){
    this.owner=owner;
}
/**
 * 
 * @param {search,type} options 
 * @param {*} cb 
 */
Repository.prototype.search=function(options, cb){
    var me=this;
    var url=me.owner.url+"/rest_v2/resources";
    var params="";
    options=options||{recursive:true};
    if(!options.recursive){
        options.recursive=true;
    }
    if(options && options.q){
        params+="q="+encodeURI(options.q)+"&";
        
    }
    if(options && options.type){
        params+="type="+encodeURI(options.type)+"&";
    }
    if(options.recursive){
        params+="recursive=true"+"&";
    }
    if(params!=""){
        url+="?"+params
    }
    function run(cb){
        try {
            request.get({
                url:url,
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
module.exports=Repository