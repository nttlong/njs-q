var es=require("./es_query");
function ES(key,index,type){
    this.key=key;
    this.index=index;
    this.type=type;

}
ES.prototype.init=function(){
    if(!this.__init){
        if(!es.isExist(this.key,this.index)){
            es.createIndex(this.key,this.index);
            this.__init=true;
        }
    }
}
ES.prototype.create=function(id,data,cb){
    this.init();
    es.postData(this.key,this.index,this.type,id, data,cb);
    return this;
};
ES.prototype.delete=function(id,db){
    this.init();
    return es.deleteData(data,cb)
};
ES.prototype.search=function(txt,pageSize,pageIndex,cb){
    this.init();
    return es.search(this.key,this.index,this.type,txt,pageSize,pageIndex,cb);
};
ES.prototype.searchByField=function(field,txt,pageSize,pageIndex,cb){
    this.init();
    return es.searchByField(this.key,this.index,this.type,field,txt,pageSize,pageIndex,cb);
};
ES.prototype.getAll=function(cb){
    this.init();
    return es.getAll(this.key,this.index,this.type,cb)
}
ES.prototype.drop=function(cb){
    this.init();
    return es.deleteIndex(this.key,this.index,cb);
}
module.exports={
    create:function(key,index,type){
        return new ES(key,index,type);
    },
    connect:es.connect
};