var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[ { "_id" : 1, "name" : "Susan",
                "phones" : [ { "cell" : "555-653-6527" },
             { "home" : "555-965-2454" } ] },
            { "_id" : 2, "name" : "Mark",
                "phones" : [ { "cell" : "555-445-8767" },
                        { "home" : "555-322-2774" } ] }];
 var contacts=coll.coll("main","contacts1");
 /*
    {
    $switch: {
        branches: [
            { case: { $eq: [ 0, 5 ] }, then: "equals" },
            { case: { $gt: [ 0, 5 ] }, then: "greater than" },
            { case: { $lt: [ 0, 5 ] }, then: "less than" }
        ]
    }
    }
  */
 try {
    
    // var ret=contacts.insert(data).commit();
    var agg=contacts.aggregate();
    agg.project({
        name:"switch(case(x>1,2),case(x>2,5),0)"
    })
    // agg.unwind("phones").match("exists(phones.cell)")
    // agg.replaceRoot("phones")
    // console.log(JSON.stringify(agg.__pipe));
    // var items=agg.items();
    // console.log(JSON.stringify(items));
 } catch (error) {
    console.log(error);
 }
 
