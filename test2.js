var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[
     { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : new Date("2014-03-01T08:00:00Z") },
     { "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : new Date("2014-03-01T09:00:00Z") },
    { "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : new Date("2014-03-15T09:00:00Z") },
    { "_id" : 4, "item" : "xyz", "price" : 5, "quantity" : 20, "date" : new Date("2014-04-04T11:21:39.736Z") },
    { "_id" : 5, "item" : "abc", "price" : 10, "quantity" : 10, "date" : new Date("2014-04-04T21:23:13.331Z") }];

 var sales=coll.coll("main","sales");
 /*
    db.sales.aggregate(
   [
      {
        $group : {
           _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
           totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
           averageQuantity: { $avg: "$quantity" },
           count: { $sum: 1 }
        }
      }
   ]
)
  */
 try {
    
    var ret=sales.insert(data).commit();
    var qr=sales.aggregate().group({
        _id:{
            month:"month(date)",
            day:"dayOfMonth(data)",
            year:"year(date)"
        },
        totalPrice:"sum(price*quantity)",
        averageQuantity:"avg(quantity)",
        count:"sum(1)"
    });
    console.log(JSON.stringify(qr.__pipe));
    var items=qr.items();
    console.log(JSON.stringify(items));
              
 } catch (error) {
    console.log(error);
 }
 
