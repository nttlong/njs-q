var mongo=require("mongodb");

function parse_contains(fx,params,prefix,parseToMongo){
    var ret={};
    var left = parseToMongo(fx.args[0], params, prefix);
    var right = parseToMongo(fx.args[1], params, prefix);
    ret[left]={
        $regex:new RegExp(right,"i")
    };
    return ret;

}
function parse_objectId(fx, params, prefix, parseToMongo){
    var ret = {};
    var left = parseToMongo(fx.args[0], params, prefix);
    return mongo.ObjectID(left);
}
function parse_elemMatch(fx,params,prefix,parseToMongo){
    //{ results: { $elemMatch: { $gte: 80, $lt: 85 } } }
    if(fx.args.length==1){
        var left = parseToMongo(fx.args[0], params, prefix);
        var keys = Object.keys(left);
        if(keys[0][0]!=="$"){
            var ret = {}
            ret[keys[0]] = { $elemMatch: left[keys[0]] };
            return ret;
        }
        else {
            if (keys[0]=="$and"){
                var subKeys = Object.keys(left[keys[0]]);
                var field = Object.keys(left[keys[0]][0])[0];
                field = Object.keys((left[keys[0]][0])[field])[0];
                var ret = {};
                ret[field] = { $elemMatch: {} };
                //ret[field].$elemMatch = {};
                for (var i = 0; i < left[keys[0]].length;i++){
                    var f = Object.keys(left[keys[0]][i])[0];
                    var f2 = Object.keys(left[keys[0]][i][f])[0];
                    var val = left[keys[0]][i][f][f2];
                    ret[field].$elemMatch[f]=val;

                }
                return ret;

            }
            else {
                var subKeys = Object.keys(left[keys[0]]);
                var ret = {};
                ret[subKeys[0]] = { $elemMatch: {} };
                ret[subKeys[0]].$elemMatch[keys[0]] = left[keys[0]][subKeys[0]];
            }
           

        }
        
    }
    else {
        var left = parseToMongo(fx.args[0], params, prefix);
        var right = parseToMongo(fx.args[1], params, prefix);
        var ret = { };
        ret[left] = { $elemMatch: right};
        return ret;

    }
}
function parse_if(fx,params,prefix,parseToMongo){
    /*
        $cond: {
           if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
           then: "$$DESCEND",
           else: "$$PRUNE"
         }
    */
    var _if=parseToMongo(fx.args[0], params, prefix);
    var _then = parseToMongo(fx.args[1], params, prefix);
    var _else = parseToMongo(fx.args[2], params, prefix);
    return {
        $cond:{
            if:_if,
            then:_then,
            else:_else
        }
    }
}
function parse_in(fx,params,prefix,parseToMongo){
    /*
         $in: ["appliances", "school"]
    */
   var ret={};
   ret[parseToMongo(fx.args[0], params, prefix)]=parseToMongo(fx.args[1], params, prefix)
   return ret;
}
function parse_fn(fx, params, prefix, parseToMongo){
    if(fx.name=="contains"){
        return parse_contains(fx, params, prefix,parseToMongo);
    }
    if (fx.name == "objectId") {
        return parse_objectId(fx, params, prefix, parseToMongo);
    }
    if (fx.name =="elemMatch"){
        return parse_elemMatch(fx, params, prefix, parseToMongo);
    }
    if (fx.name =="if"){
        return parse_if(fx, params, prefix, parseToMongo);
    }
    if (fx.name =="in"){
        return parse_in(fx, params, prefix, parseToMongo);
    }
}

module.exports=parse_fn;