use test001
db.loadServerScripts();
var x=jsep("a+b+c",["XX"],true);

// var p= x('1+1')
// console.log(p)
// var keys=Object.keys(x)
// keys.forEach(k=>{
    
// })


function js_parse(fx,params,forSelect){
    var avgFuncs=";$avg;$sum;$min;$max;$push;"
    var ret={};
    var op={
        "==":"$eq",
        "!=":"$ne",
        ">":"$gt",
        "<":"$lt",
        ">=":"$gte",
        "<=":"$lte",
        "+":"$add",
        "-":"$subtract",
        "*":"$multiply",
        "/":"$divide",
        "%":"$mod"
    }
    var mathOp=";$add;$subtract;$multiply;$divide;$mod;"
    var logical={
        "&&":"$and",
        "||":"$or"
    }
   
    if(fx.type==='Identifier'){
        return fx.name;
    }
    if(fx.type==='MemberExpression'){
        var left=js_parse(fx.object,params,forSelect)
        return left+"."+fx.property.name
    }
    if(fx.type=='Literal'){
        return fx.value;
    }
    if(fx.type==='BinaryExpression'){
        ret={}
        var right = js_parse(fx.right,params,forSelect)
        var left = js_parse(fx.left,params,forSelect)
        if(fx.operator=='=='){
        
            if(typeof right=="string"){
                
                ret[left]={
                    $regex:new RegExp("^"+right+"$","i")
                    
                };
                return ret
            }
        }
        ret[op[fx.operator]]=[left,right];
            return ret;
        
        
    }
    if(fx.type==='LogicalExpression'){
        var ret={}
        ret[logical[fx.operator]]=[js_parse(fx.left,params,true),js_parse(fx.right,params,true)]
        return ret
    }
    if(fx.type==='BinaryExpression'){
        
    }
    if(fx.type==='CallExpression'){
        if(fx.callee.name==="$exists"){
            ret={};
            ret[js_parse(fx.arguments[0],params,true)]={
                $exists:1
            }
            return ret;
        }
        if(avgFuncs.indexOf(fx.callee.name)>-1){
            ret={};
            ret[fx.callee.name]=js_parse(fx.arguments[0],params,true);
            return ret;
        }
        if(fx.callee.name=="getParams"){
            
            return params[fx.arguments[0].value];
        }
        if(fx.callee.name==='expr'){
            ret={
                $expr:js_parse(fx.arguments[0],params,true)
            };
            return ret
        }
        if(fx.callee.name==="$regex"){
            var left=js_parse(fx.arguments[0],params,true);
            var right=js_parse(fx.arguments[1],params,true);
            ret={}
            if(fx.arguments.length==2){
                ret[left]={
                    $regex: new RegExp(right)
                };    
            }
            else if(fx.arguments.length==3) {
                ret[left]={
                    $regex: new RegExp(right,js_parse(fx.arguments[2],params,true))
                }; 
            }
            
            return ret;
        }
        if(fx.callee.name==="$iif"){
            return {
                $cond: {
                   "if": js_parse(fx.arguments[0],params,true),
                   "then": js_parse(fx.arguments[1],params,true),
                   "else": js_parse(fx.arguments[2],params,true)
                }
            }
        }
        if(fx.callee.name=="switch"){
           
            ret={
                $switch:{
                    branches:[],
                    default:js_parse(fx.arguments[fx.arguments.length-1],params,true)
                }
            }
            for(var i=0;i<fx.arguments.length-1;i++){
                ret.$switch.branches.push(js_parse(fx.arguments[i],params,true));
            }
            return ret;
        }
        if(fx.callee.name=="case"){
            return {
                case:js_parse(fx.arguments[0],params,true),
                then:js_parse(fx.arguments[1],params,true)
            }
        }
        else {
            ret={};
            var args=[];
            for(var i=0;i<fx.arguments.length;i++){
                args.push(js_parse(fx.arguments[i],params,true))
            }
            ret[fx.callee.name]=args;
            return ret;
        }
    }
}


console.log(x)
// console.log(JSON.stringify(x.right))
console.log(JSON.stringify(js_parse(x,["XX"],false))) 
//db.getCollection("hrm.auth_user").find(js_parse(x))