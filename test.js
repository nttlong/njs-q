var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[
    { "_id" : 1, "item" : "tangerine", "type" : "citrus" },
    { "_id" : 2, "item" : "lemon", "type" : "citrus" },
    { "_id" : 3, "item" : "grapefruit", "type" : "citrus" }
];
var fruit=coll.coll("main","test.fruit");   
try {
    fruit.insert(data).commit();
} catch (error) {
    console.log(error)
}
 
 
 /*
    db.fruit.aggregate( [
    {
        $addFields: {
        _id : "$item",
        item: "fruit"
        }
    }
    ] )

  */
 var qr=fruit.aggregate()
 qr.addFields({
     _id:"item",
     item:"fruit"
 })

console.log(JSON.stringify(qr.__pipe));
var items=qr.items();
console.log(JSON.stringify(items));
