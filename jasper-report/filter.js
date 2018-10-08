var _resourceType={
    none:"",
    folder:"folder",
    jndiJdbcDataSource:"jndiJdbcDataSource",
    jdbcDataSource:"jdbcDataSource",
    awsDataSource:"awsDataSource",
    reportUnit:"reportUnit",
    virtualDataSource:"virtualDataSource",
    customDataSource:"customDataSource",
    beanDataSource:"beanDataSource",
    xmlaConnection:"xmlaConnection",
    query:"query",
    file:"file",
    reportOptions:"reportOptions",
    semanticLayerDataSource:"semanticLayerDataSource",
    domainTopic:"domainTopic",
    mondrianConnection:"mondrianConnection"

}
var _resource_sort_fields={
    none:"",
    uri:"uri",
    label:"label",
    description:"description",
    type:"type",
    creationDate:"creationDate",
    updateDate:"updateDate",
}
function filterOptions(){
    this.name_or_description=undefined;
    this.folderUri=undefined;
    this.type="";
    this.sortBy="";
    this.pageSize=50;
    this.pageIndex=0;
}
filterOptions.prototype.setSearch=function(val){
    this.name_or_description=val;
    return this;
}
filterOptions.prototype.setFolderUri=function(val){
    this.folderUri=val;
    return this;
}
filterOptions.prototype.setType=function(val){
    if(!_resourceType[val]){
        var keys=Object.keys(_resourceType);
        var msg="";
        keys.forEach(function(k){
            msg+=k+"\r\n";
        })
        throw(new Error("'"+val+"' is invalid value.\r\n The value mus be in bellow:\r\n"+msg ));
    }
    this.type=val;
    return this;
}
filterOptions.prototype.setSortBy=function(val){
    if(!_resource_sort_fields[val]){
        var keys=Object.keys(_resource_sort_fields);
        var msg="";
        keys.forEach(function(k){
            msg+=k+"\r\n";
        })
        throw(new Error("'"+val+"' is invalid value.\r\n The value mus be in bellow:\r\n"+msg ));
    }
    this.sortBy=val;
    return this;
}
filterOptions.prototype.setPageSize=function(val){
    this.pageSize=val
    return this;
}
filterOptions.prototype.setPageIndex=function(val){
    this.pageIndex=val
    return this;
}
filterOptions.prototype.toString=function(){
    this.limit=this.pageSize;
    this.offset=this.pageIndex*this.pageSize;
    ret="limit="+this.limit+"&offset="+this.offset+"&forceFullPage=false&forceTotalCount=true&";
    if (this.name_or_description!=undefined && this.name_or_description!=""){
        ret=ret+"q="+(this.name_or_description)+"&"
    }
    
    if (this.folderUri!=undefined && this.folderUri!=""){
        ret = ret + "folderUri=" + this.folderUri + "&"
    }
    
    if (this.type!=undefined && this.type!=""){
        ret = ret + "type=" + this.type + "&"
    }
    
    if (this.sortBy!=undefined && this.sortBy!=""){
        ret = ret + "sortBy=" + this.sortBy+ "&"
    }
    
    return ret.substring(0,ret.length-1)
}
module.exports={
    create:function(){
        return new filterOptions();
    },
    filterOptions:filterOptions,
    resourceTypes:_resourceType,
    fields:_resource_sort_fields
}