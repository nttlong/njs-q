var coll=require("./q-coll");
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