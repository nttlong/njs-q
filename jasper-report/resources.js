var filterOptions=require("./filter").filterOptions
var sync=require("./sync");
var request=require("request");
var ReportInfo=require("./reportInfo").ReportInfo
var FolderInfo=require("./FolderInfo");
function Resource(owner){
    this.owner=owner;
}
/**
 * 
 * @param {filterOptions} options 
 * @param {*} cb 
 */
Resource.prototype.search=function(options, cb){
    if(! options instanceof filterOptions){
        throw(new Error("options must be 'jasper-report/filter.filterOptions"));
    }
    var me=this;
    var url=me.owner.url+"/rest_v2/resources";
    var params="";
    url=url+"?"+options.toString();
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
                      var totalItems=res.headers["result-count"]||0;
                      var totalPages=Math.floor(totalItems/options.pageSize);
                      if(totalItems % options.pageSize>0){
                        totalPages++;
                      }
                      var retBody=res.body||{}
                      var ret={
                          items:retBody.resourceLookup,
                          totalPages:totalPages,
                          pageSize:options.pageSize,
                          pageIndex:options.pageIndex

                      }
                      cb(null,ret);
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
 * 
 * @param {string} pathToResource 
 * @param {*} cb 
 */
Resource.prototype.getInfo=function(pathToResource,cb){
    while(pathToResource[0]==='/'){
        pathToResource=pathToResource.substring(1,pathToResource.length-1);
    }
    var me=this;
    var url=me.owner.url+"/rest_v2/resources";
    var params="";
    url=url+"/"+pathToResource
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
}
/**
 * 
 * @param {FolderInfo} info 
 * @param {*} cb 
 */
Resource.prototype.createFolder=function(info,cb){
    if(! info instanceof FolderInfo){
        throw(new Error("Parameter must be FolderInfo"))
    }
    while(info.uri[0]==='/'){
        info.uri=info.uri.substring(1,info.uri.length-1);
    }
    var me=this;
    var url=me.owner.url+"/rest_v2/resources";
    url=url+"/"+info.uri+"?createFolders=true&overwrite=true"
    function run(cb){
        try {
            request.put({
                url:url,
                headers: {
                    'Content-Type': 'application/repository.folder+json' 
                 } ,
                'auth': me.owner.__getAuth(),
                json: true,
                body:({
                    "uri" :"/"+info.uri, 
                    "label":info.label,
                     "description":info.description
                })
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
/**
 * 
 * @param {ReportInfo} info 
 */
Resource.prototype.publishReport=function(info,cb){
    var fs=require("fs");
    if(! info instanceof ReportInfo){
        throw(new Error("parameter must be reportInfo.ReportInfo"))
    }
    var me=this;
    var url=me.owner.url+"/rest_v2/resources/"+info.uri;
    var des={
        "label": info.label,
        "description": info.description||"No description",
        "alwaysPromptControls": "true",
        "controlsLayout": "popupScreen",
        "dataSource": {
            "dataSourceReference": {
                "uri": info.dataSourcePath
            }
        },
        "jrxml": {
            "jrxmlFile": {
                "label": info.label,
                "type": "jrxml"
            }
        }   
    }
    function run(cb){
        request.put({
            url: url,
            auth:  me.owner.__getAuth(), 
            formData: {
                resource: {
                value: JSON.stringify(des),
                options: {
                    contentType: "application/repository.reportUnit+json"
                }
                },
                jrxml: fs.createReadStream(info.fileName),
            },
            json: true,
        }, function(err, response, body) {
            if(err){
                cb(err);
            }
            else {
                cb(response.body);
            }
        });
    }
    if(cb) run(cb);
    else {
        return sync.sync(run,[]);
    }

}   
module.exports=Resource