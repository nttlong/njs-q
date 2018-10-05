var sync=require("./sync");
var request=require("request");
function Reports(owner){
    this.owner=owner;
}
/**
 * http://<host>:<port>/jasperserver[-pro]/rest_v2/reports/
    path/to/report.<format>?<arguments>
 * @param {*} txtSearch 
 * @param {*} cb 
 */
Reports.prototype.run=function(pathToReport,format, cb){
    var me=this;
    function run(cb){
        try {
            request.get({
                url:me.owner.url+"/rest_v2/reports/reports/"+pathToReport+"."+format+"?format="+format,
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
/**
 * Finding Running Reports
 * @param {*} userId 
 * @param {*} cb 
 */
Reports.prototype.findRunning=function(pathToReport, cb){
    var me=this;
    function run(cb){
        try {
            request.get({
                url:me.owner.url+"/rest_v2/users/reports/"+encodeURI(pathToReport),
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

module.exports=Reports