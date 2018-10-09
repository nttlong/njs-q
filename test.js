var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[{
    "_id" : 1,
    title: "abc123",
    isbn: "0001122223334",
    author: { last: "zzz", first: "aaa" },
    copies: 5
  }]
 var books=coll.coll("main","books3");
 /*
   db.books.aggregate(
   [
      {
         $project: {
            title: 1,
            isbn: {
               prefix: { $substr: [ "$isbn", 0, 3 ] },
               group: { $substr: [ "$isbn", 3, 2 ] },
               publisher: { $substr: [ "$isbn", 5, 4 ] },
               title: { $substr: [ "$isbn", 9, 3 ] },
               checkDigit: { $substr: [ "$isbn", 12, 1] }
            },
            lastName: "$author.last",
            copiesSold: "$copies"
         }
      }
   ]
)
  */
 try {
     var ret=books.insert(data).commit();
    
    var agg=books.aggregate();
    agg.project({
        title:1,
        isbn:{
            prefix:"substr(isbn,0,3)",
            group:"substr(isbnm,3,2)",
            publisher:"substr(isbn,9,3)",
            checkDigit:"substr(isbn,12,1)"
        },
        lastName: "author.last",
        copiesSold: "copies"})
    var items=agg.items();
    console.log(JSON.stringify(items));
 } catch (error) {
    console.log(error);
 }
 
