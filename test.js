var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[{
    "_id" : 1,
    title: "abc123",
    isbn: "0001122223334",
    author: { last: "zzz", first: "aaa" },
    copies: 5,
    lastModified:new Date("2016-07-28")
  },
  {
    "_id" : 2,
    title: "Baked Goods",
    isbn: "9999999999999",
    author: { last: "xyz", first: "abc", middle: "" },
    copies: 2,
    lastModified:new Date("2017-07-21")
  },
  {
    "_id" : 3,
    title: "Ice Cream Cakes",
    isbn: "8888888888888",
    author: { last: "xyz", first: "abc", middle: "mmm" },
    copies: 5,
    lastModified:new Date("2017-07-22")
  }]
 var books=coll.coll("main","books1");
 /***
  * db.books.aggregate( [
   {
      $project: {
         title: 1,
         "author.first": 1,
         "author.last" : 1,
         "author.middle": {
            $cond: {
               if: { $eq: [ "", "$author.middle" ] },
               then: "$$REMOVE",
               else: "$author.middle"
            }
         }
      }
   }
] )
  */
 try {
    // var ret=books.insert(data).commit();
    // console.log(ret);    
    //db.books.aggregate( [ { $project : { title : 1 , author : 1 } } ] )
    var agg=books.aggregate();
    agg.project({
        title:1,
        "author.first": 1,
        "author.last" : 1,
        "author.middle":"if($author.middle=={0},{1},author.middle)"
    },"","$$REMOVE")
    var items=agg.items();
    console.log(items);
 } catch (error) {
    console.log(error);
 }
 
