var coll=require("./q-coll");
var db=require("mongodb").MongoClient

coll.db("main","mongodb://root:123456@localhost:27017/hrm");
var data=[
    {
        _id: 1,
        student: "Maya",
        homework: [ 10, 5, 10 ],
        quiz: [ 10, 8 ],
        extraCredit: 0
      },
      {
        _id: 2,
        student: "Ryan",
        homework: [ 5, 6, 5 ],
        quiz: [ 8, 8 ],
        extraCredit: 8
      }     

];

 var scores=coll.coll("main","scores-1");
 /*
    db.scores.aggregate( [
    {
        $addFields: {
        totalHomework: { $sum: "$homework" } ,
        totalQuiz: { $sum: "$quiz" }
        }
    },
    {
        $addFields: { totalScore:
        { $add: [ "$totalHomework", "$totalQuiz", "$extraCredit" ] } }
    }
    ] )
  */
 try {
    
    var ret=scores.insert(data).commit();
    var qr=scores.aggregate().addFields({
        totalHomework:"sum(homework)",
        totalQuiz:"sum(quiz)"
    }).addFields({
        totalScore:"totalHomework+totalQuiz+extraCredit"
    })
    console.log(JSON.stringify(qr.__pipe));
    var items=qr.items();
    console.log(JSON.stringify(items));
              
 } catch (error) {
    console.log(error);
 }
 
