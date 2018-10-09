var sync=require("./sync");
function applyView(db,key,info){
    function run(cb){
        var txtCommand="db.createView("+JSON.stringify(key)+","+
                                        JSON.stringify(info.source)+","+
                                        JSON.stringify(info.pipe)+")";
        db.collection(key).drop().then(function(r){
            db.eval(txtCommand,function(e,r){
                cb(e,r);
            })
        }).catch(function(ex){
            cb(ex);
        })
        
    }
    return sync.sync(run,[]);
}
function applyAllViews(db,schema){
    var keys=Object.keys(global.__mongodb__views__);
    for(var i=0;i<keys.length;i++){
        var key=keys[i];
        var xKey=key;
        if(schema){
            xKey=schema+"."+key;
        }
        if(!global.__mongodb__views_has_created__[xKey]){
            applyView(db,xKey,global.__mongodb__views__[key]);
        }
    }
    
}
module.exports=applyAllViews;