var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }];

 var books=coll.coll("main","books2");
 /*
    db.books.aggregate(
    [
        { $group : { _id : "$author", books: { $push: "$title" } } }
    ]
    )
  */
 try {
    
    // var ret=books.insert(data).commit();
    var qr=books.aggregate().group({
        _id:"author",
        books:"push(title)"
    });
    console.log(JSON.stringify(qr.__pipe));
    var items=qr.items();
    console.log(JSON.stringify(items));
              
 } catch (error) {
    console.log(error);
 }
 
