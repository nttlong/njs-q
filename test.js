var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[{
    _id: 1,
    title: "123 Department Report",
    tags: [ "G", "STLW" ],
    year: 2014,
    subsections: [
      {
        subtitle: "Section 1: Overview",
        tags: [ "SI", "G" ],
        content:  "Section 1: This is the content of section 1."
      },
      {
        subtitle: "Section 2: Analysis",
        tags: [ "STLW" ],
        content: "Section 2: This is the content of section 2."
      },
      {
        subtitle: "Section 3: Budgeting",
        tags: [ "TK" ],
        content: {
          text: "Section 3: This is the content of section3.",
          tags: [ "HCS" ]
        }
      }
    ]
  }]
 var forecasts=coll.coll("main","forecasts");
 /*
   db.forecasts.aggregate(
   [
     { $match: { year: 2014 } },
     { $redact: {
        $cond: {
           if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
           then: "$$DESCEND",
           else: "$$PRUNE"
         }
       }
     }
   ]
);
)
  */
 try {
    var userAccess = [ "STLW", "G" ];
    //  var ret=forecasts.insert(data).commit();
    
    var agg=forecasts.aggregate();
    agg.match("year==2014")
    agg.redact("if(size(setIntersection(tags,{0}))>0,{1},{2})",userAccess,"$$DESCEND","$$PRUNE");
    console.log(JSON.stringify(agg.__pipe));
    var items=agg.items();
    console.log(JSON.stringify(items));
 } catch (error) {
    console.log(error);
 }
 
