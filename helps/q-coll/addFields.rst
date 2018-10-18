https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#examples
    .. code-block::

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
        var scores=coll.coll("main","test.scores");
        try {
            scores.insert(data).commit();
        } catch (error) {
            console.log(error)
        }


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
         var qr=scores.aggregate()
         qr.addFields({
            totalHomeWork:"sum(homwork)",
            totalQuiz:"sum(quiz)"
         }).addFields({
            totalScore:"totalHomeWork+totalQuiz"
         })

        console.log(JSON.stringify(qr.__pipe));
        var items=qr.items();
        console.log(JSON.stringify(items));

`The example "Adding Fields to an Embedded Document" from Mongodb <https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#adding-fields-to-an-embedded-document>`_
    .. code-block::

        var data=[
            { _id: 1, type: "car", specs: { doors: 4, wheels: 4 } },
            { _id: 2, type: "motorcycle", specs: { doors: 0, wheels: 2 } },
            { _id: 3, type: "jet ski" }
        ];
        var vehicles=coll.coll("main","test.vehicles");
        try {
            vehicles.insert(data).commit();
        } catch (error) {
            console.log(error)
        }


         /*
            db.vehicles.aggregate( [
                {
                   $addFields: {
                      "specs.fuel_type": "unleaded"
                   }
                }
           ] )

          */
         var qr=vehicles.aggregate()
         qr.addFields({
            "specs.fuel_type": "unleaded"
         })

        console.log(JSON.stringify(qr.__pipe));
        var items=qr.items();
        console.log(JSON.stringify(items));

Overwriting an existing field
    https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#overwriting-an-existing-field
        .. code-block::

            var data=[
                { _id: 1, dogs: 10, cats: 15 }
            ];
            var animals=coll.coll("main","test.animals");
            try {
                animals.insert(data).commit();
            } catch (error) {
                console.log(error)
            }


             /*
                db.animals.aggregate( [
                {
                    $addFields: { "cats": 20 }
                }
                ] )

              */
             var qr=animals.aggregate()
             qr.addFields({
                 cats:20
             })

            console.log(JSON.stringify(qr.__pipe));
            var items=qr.items();
            console.log(JSON.stringify(items));


        .. code-block::

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