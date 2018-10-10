var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[{
    _id: 1,
    level: 1,
    acct_id: "xyz123",
    cc: {
      level: 5,
      type: "yy",
      num: 000000000000,
      exp_date: new Date("2015-11-01T00:00:00.000Z"),
      billing_addr: {
        level: 5,
        addr1: "123 ABC Street",
        city: "Some City"
      },
      shipping_addr: [
        {
          level: 3,
          addr1: "987 XYZ Ave",
          city: "Some City"
        },
        {
          level: 3,
          addr1: "PO Box 0123",
          city: "Some City"
        }
      ]
    },
    status: "A"
  }]
 var forecasts=coll.coll("main","forecasts1");
 /*
    db.accounts.aggregate(
    [
        { $match: { status: "A" } },
        {
        $redact: {
            $cond: {
            if: { $eq: [ "$level", 5 ] },
            then: "$$PRUNE",
            else: "$$DESCEND"
            }
        }
        }
    ]
    );
  */
 try {
    
    // var ret=forecasts.insert(data).commit();
    var agg=forecasts.aggregate();
    agg.match("status=={0}","A")
    agg.redact("if(level==5,{1},{0})","$$DESCEND","$$PRUNE");
    console.log(JSON.stringify(agg.__pipe));
    var items=agg.items();
    console.log(JSON.stringify(items));
 } catch (error) {
    console.log(error);
 }
 
