var mongoose=require("mongoose");
var Schema = mongoose.Schema;
global.__mongoose_models__={}
global.__mongoose_coll_models__={}
global.__mongoose_models_require_fields__={}
global.__mongodb_schema_validators__={}
global.__mongodb_indexes__={}
var map_bsonTypes={
    "double":Number,
    "string":String	, 
    "object"	 :Object,
    "array"	 :Array,
    "binData":Object,	 
    "ObjectId":Object,
    "bool":Boolean,	 
    "date":Date ,
    "int":Number,	 
    "timestamp":Date,	 
    "long":Number,	 
    "decimal":Number,
    "“minKey":Number,	 
    "maxKey":Number	 
};
function createSchema(obj){
    var keys=Object.keys(obj);
    var ret={}
    for(var i=0;i<keys.length;i++){
        var val=obj[keys[i]]
        
        if(typeof val=="string"){
            val = map_bsonTypes[val];
            if(!val){
                throw("'"+obj[keys[i]]+"' is not bsontype");
            }
        }
        if(typeof val.type=="string"){
            var _t= val.type
            val.type = map_bsonTypes[val.type];
            if(!val){
                throw("'"+_t+"' is not bsontype");
            }
        }
        if(val.type && val.type instanceof Object && val.fields){
            val =createSchema(val.fields)
        }
        else {
            if(val instanceof Array){
                var _val=[];
                for(var i=0;i<val.length;i++){
                    _val.push(createSchema(val[i]));
                }
            }
        }
        ret[keys[i]]=val;
    }
    return new Schema(ret);
}
function getRequireFields(obj){
    var ret=[];
    var keys=Object.keys(obj);
    for(var i=0;i<keys.length;i++){
        var val=obj[keys[i]];
        if(val.required!==undefined){
            ret.push(keys[i]);
        }
        if(val.type && val.type instanceof Object && val.fields){
            var fields=getRequireFields(val.fields);
            for(var j=0;j<fields.length;j++){
                ret.push(keys[i]+"."+fields[j])
            }
        }
    }
    return ret;
}
/**
 phone: {
            bsonType: "string",
            description: "must be a string and is required"
         },
 */


function getProperties(obj){
    var ret=[];
    var keys=Object.keys(obj);
    for(var i=0;i<keys.length;i++){
        var val=obj[keys[i]]
        if(typeof val=="string"){
            ret.push({
                field:keys[i],
                bsonType:val,
                description:"'"+keys[i]+"' must be '"+val+"'"
            });
        }
        if(val === String){
            ret.push({
                field:keys[i],
                bsonType:"string",
                description:"'"+keys[i]+"' must be 'string'"
            });
        }
        if(val === Date){
            ret.push({
                field:keys[i],
                bsonType:"date",
                description:"'"+keys[i]+"' must be 'date'"
            });
        }
        if(val === Number){
            ret.push({
                field:keys[i],
                bsonType:"double",
                description:"'"+keys[i]+"' must be 'double'"
            });
        }
        if(val === Boolean){
            ret.push({
                field:keys[i],
                bsonType:"bool",
                description:"'"+keys[i]+"' must be 'bool'"
            });
        }
        if(val.type === String){
            ret.push({
                field:keys[i],
                bsonType:"string",
                description:"'"+keys[i]+"' must be 'string'"
            });
        }
        if(val.type === Date){
            ret.push({
                field:keys[i],
                bsonType:"date",
                description:"'"+keys[i]+"' must be 'date'"
            });
        }
        if(val.type === Number){
            ret.push({
                field:keys[i],
                bsonType:"double",
                description:"'"+keys[i]+"' must be 'double'"
            });
        }
        if(val.type === Boolean){
            ret.push({
                field:keys[i],
                bsonType:"bool",
                description:"'"+keys[i]+"' must be 'bool'"
            });
        }
        if(typeof val.type=="string"){
            ret.push({
                field:keys[i],
                bsonType:val.type,
                description:"'"+keys[i]+"' must be '"+val+"'"
            });
        }
        if(val.type && val.type instanceof Object && val.fields){
            var fields=getProperties(val.fields);
            for(var j=0;j<fields.length;j++){
                ret.push({
                    field:keys[i]+"."+fields[j].field,
                    bsonType:fields[j].bsonType,
                    description:"'"+keys[i]+"."+fields[j].field+"' must be '"+fields[j].bsonType+"'"
                })
            }
        }
    }
    return ret;
}
function FieldInfo(){
    this.required=false;
    this.bsonType="";
    this.description=""
}
/**
 * 
 * @param {string} collectionName 
 * @param {[x:FieldInfo]:FieldInfo} fields 
 */
function schema(collectionName,fields,indexes){
    var properties=getProperties(fields);
    global.__mongoose_models__[collectionName]={
        coll:collectionName,
        schema:createSchema(fields)
    }
    var requiredFields=getRequireFields(fields);
    global.__mongoose_coll_models__[collectionName]=collectionName;
    var objproperties={};
    for(var i=0;i<properties.length;i++){
        objproperties[properties[i].field]={
            bsonType:properties[i].bsonType,
            description:properties[i].description
        }
    }
    global.__mongodb_schema_validators__[collectionName]={
        collMod:collectionName,
        validator:{
                $jsonSchema:{
                bsonType:"object",
                required:requiredFields,
                properties:objproperties
            }
        },
        validationLevel: "moderate"
    };
    if(indexes){
        global.__mongodb_indexes__[collectionName]=indexes;
    }
}
function create(cnn,name){
    if(!global.__mongoose_models__[name].__model){
        global.__mongoose_models__[name].__model = cnn.model(
            global.__mongoose_models__[name].coll,
            global.__mongoose_models__[name].schema
        );
    }
    return new global.__mongoose_models__[name].__model();
}
function getModelNameByCollectionName(collName){
    return global.__mongoose_coll_models__[collName]
}
function getValidator(collectionName){
    return global.__mongodb_schema_validators__[collectionName];

}
module.exports ={
    schema:schema,
    create:create,
    getModelNameByCollectionName:getModelNameByCollectionName,
    getValidator:getValidator
}