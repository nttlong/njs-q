var fn=require("./parse_functions");
const operators = {
    ">": "$gt",
    ">=": "$gte",
    "<": "$lt",
    "<=": "$lte",
    "==": "$eq",
    "!=": "$ne",
    "*": "$multiply",
    "+": "$add",
    "-": "$subtract",
    "/": "$divide",
    "%": "$mod",
    "and": "$and",
    "or": "$or"

};
const avg_functions=";sum;min;max;avg;stdDevPop;stdDevSamp;meta;first;last;not;";
var functions =";contains;start;end;objectId;elemMatch;if;switch;case;";
function parseToMongo(fx,params,prefix){
    var ret ={}
    if(fx.type==="ParenthesisNode"){
        return parseToMongo(fx.content,params,prefix);
    }
    if (fx.type =="SymbolNode"){
        ret=fx.name;
        while (ret.indexOf("_$$$$_dot_$$$$_")>-1){
            ret = ret.replace("_$$$$_dot_$$$$_",".");
        }
        return (prefix) ? (prefix + ret) : ret;
    }
    if (fx.type == "ConstantNode"){
        return fx.value;
    }
    if (fx.type =="FunctionNode"){

        if(functions.indexOf(";"+fx.name+";")>-1){
            return fn(fx,params,prefix,parseToMongo);

        }

        if(fx.name=="get_param"){
            return params[fx.args[0].value];
        }
        else if(fx.name=="expr"){
            return {
                "$expr": parseToMongo(fx.args[0], params)
            };
        }
        else if (avg_functions.indexOf(";"+fx.name+";")>-1){
            ret["$" + fx.name]=parseToMongo(fx.args[0], params,"$");
            return ret;
        }
        else {
            ret["$" + fx.name] = [];
            for (var i = 0; i < fx.args.length; i++) {
                var x = parseToMongo(fx.args[i], params,"$");
                ret["$" + fx.name].push(x);
            }
            return ret;
        }
        

    }
    if (fx.type =="OperatorNode"){
        
        var left = parseToMongo(fx.args[0], params);
        if(fx.op==="not"){
            return {
                $not:left
            };   
        }
        ret[left] = {};
        
        if(typeof left=="string" && fx.op==="=="){
            var right = parseToMongo(fx.args[1], params);
            ret[left][operators[fx.op]] = right;
            if (typeof right == "string" && fx.op==="==") {
                ret = {};
                ret[left] = { $regex: new RegExp("^" + right + "$", "i") };
                return ret;
            }
            else {
                ret = {};
                ret[left] =  right ;
                return ret;
            }
                
        }
        else {
            var left = parseToMongo(fx.args[0], params,"$");
            var right = parseToMongo(fx.args[1], params,"$");
            ret={}
            ret[operators[fx.op]]=[left,right];
        }
        
        return ret;
    }
    console.log(fx.type);

}
module.exports =parseToMongo;