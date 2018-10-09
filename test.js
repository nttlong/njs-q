var coll=require("./q-coll");
var db=require("mongodb").MongoClient
db()
coll.db("main","mongodb://root:123456@localhost:27017/hrm");
coll.schema("long_test_001",{
    "code":{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        require:true
    },
    hitCount:"array",
    department:{
        type:Object,
        fields:{
            code:String

        }
    }
},[
    {code:1,name:1}
]);

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var qr=coll.coll("main","collection1");
try {
    var r= qr.insert({code:"001",level:15}).commit() //sync call
    console.log(r);    
} catch (error) {
    console.error(error);
}
//asyn call
qr.insert({code:"001",level:15}).commit(function(err,res){
    console.log(res);
    console.error(err);
});

try {
    //sync call
    var ret=qr.insert([
        {
            code:"001",
            level:15
        },{
            code:"002",
            level:29
        }
    ]) ;
    console.log(ret); 
} catch (error) {
    console.error(error);
}
//async call
qr.insert([
    {
        code:"001",
        level:15
    },{
        code:"002",
        level:29
    }
],function(e,r){
    console.log(r);
    console.log(e);
}) ;

qr.where("code=={0} and level=={1}","CodeFind",1);
var item=qr.item()


coll.use("main","test00001",context=>{
    
    // context.getDb().collections().
    // var r=context.sync(function(cb){
    //     context.getDb().collections().then(r=>{
    //         cb(null,r);
    //     }).catch(ex=>{cb(ex)});
    // });
    // var c=context.coll("long_test_001").insert({})
    // c.commit();
    var m=context.coll("long_test_001").inc({hitCount:1})
    //.insert({code:"XXX"})
    var fx=m.commit();
    // var r=context.coll("long_test_001").aggregate().items();
    console.log(fx);
    // context.coll().getDb().collections().
});
//coll.createValidator("vvv").properties()