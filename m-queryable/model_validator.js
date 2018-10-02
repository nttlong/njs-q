var sync=require("./sync");
function convertToString(obj){
    if(typeof obj=="string") return obj;
    if (typeof obj=="boolean") return obj;
    if (typeof obj=="number") return obj;
    if (typeof obj=="undefined") return obj;
    if (obj instanceof Date) return obj;
    if (obj instanceof Array) {
        var ret=[];
        for(var i=0;i<obj.length;i++){
            ret.push(convertToString(obj[i]));
        }
        return ret;
    }
    var ret={};
    var keys=Object.keys(obj);
    for(var i=0;i<keys.length;i++){
        var val=obj[keys[i]];
        if(typeof val=="function"){
            val=val.toString();
        } else {
            val=convertToString(val);
        }
        ret[keys[i]]=val;
    }
    return ret;

}
function validator(name){
    this.name=name;
    if(!global.__mongodb_validator){
        global.__mongodb_validator={};
    }
    this.__validator=global.__mongodb_validator[name] = {
        $jsonSchema:{
            bsonType:"object",
            required:[],
            properties:{}
        }
    }
};
validator.prototype.requiredFields=function(){
    for(var i=0;i<arguments.length;i++){
        this.__validator.$jsonSchema.required.push(arguments[i]);
    }
    return this;
};
validator.prototype.properties=function(fields){
    this.__validator.$jsonSchema.properties=fields;
    return this;
}
validator.prototype.createCollection=function(db,cb){
    var me=this;
    function exec(cb){
        db.createCollection(me.name,{
            validator:me.__validator
        },cb);
    }
    if(cb) exec(cb);
    else {
        return sync.sync(exec,[]);
    }
};
function applyAll(db,cb){
    var keys=Object.keys(global.__mongodb_validator);
        var p=sync.parallel();
        for(var i=0;i<keys.length;i++){
            p.call(function(cb){
                var cmd=convertToString({
                    collMod:keys[i],
                    validator:global.__mongodb_validator[keys[i]],
                    validationLevel:"strict",
                    validationAction:"moderate"
                });
                db.eval("db.runCommand("+JSON.stringify(cmd)+")",function(e,r){
                            cb(e,r);        
                    });
                // db.createCollection(keys[i],{
                //     validator:global.__mongodb_validator[keys[i]]
                // },function(ex,r){
                //     cb(e,r);
                // });
            });
        }
        if(cb) p.callback(cb);
        else {
            return p.sync();
        }

}
module.exports ={
    create:function(name){
        return new validator(name)
    },applyAll:applyAll
}