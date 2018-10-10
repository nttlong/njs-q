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
           db.contacts.aggregate( [
    {
        $unwind: "$phones"
    },
    {
        $match: { "phones.cell" : { $exists: true } }
    },
    {
        $replaceRoot: { newRoot: "$phones"}
    }
    ] )
  */
 try {
    
    var ret=contacts.insert(data).commit();
    var agg=contacts.aggregate();
    
    agg.unwind("phones").match("exists(phones.cell)")
    agg.replaceRoot("phones")
    console.log(JSON.stringify(agg.__pipe));
    var items=agg.items();
    console.log(JSON.stringify(items));
 } catch (error) {
    console.log(error);
 }
 
