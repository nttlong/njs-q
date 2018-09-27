var json=require("../q-json");
function post(req,res,next){
    if(req.body[0]==="{"){
        req.postData=json.toJSON(req.body);

    }
    else {
        req.postData={};
        var items=req.body.split("&");
        for(var i=0;i<items.length;i++){
            var key=items[i].split('=')[0];
            var val=items[i].split('=')[1];
            while(val.indexOf("+")>-1){
                val=val.replace("+",escape(" "));
            }
            req.postData[key] = decodeURI(val);
        }

    }
    return req.postData;
}
module.exports =post
