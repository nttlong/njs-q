https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#examples
    .. code-block::

        db.loadServerScripts();
        db.scores.remove({});
        db.scores.insertMany([
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
        ])

        // db.scores.aggregate( [
        //   {
        //      $addFields: {
        //       totalHomework: { $sum: "$homework" } ,
        //       totalQuiz: { $sum: "$quiz" }
        //      }
        //   },
        //   {
        //      $addFields: { totalScore:
        //       { $add: [ "$totalHomework", "$totalQuiz", "$extraCredit" ] } }
        //   }
        // ] )

        query("scores").addFields({
            totalHomework:"sum(homework)",
            totalQuiz:"sum(quiz)"
        })
        .addFields({
            totalScore:"totalHomework+totalQuiz+extraCredit"
        }).items()

Adding Fields to an Embedded Document
    https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#adding-fields-to-an-embedded-document
        .. code-block::

            db.loadServerScripts();

            db.vehicles.remove({})
            db.vehicles.insertMany([
                            { _id: 1, type: "car", specs: { doors: 4, wheels: 4 } },
                            { _id: 2, type: "motorcycle", specs: { doors: 0, wheels: 2 } },
                            { _id: 3, type: "jet ski" }
                        ])

            //             /*
            //                 db.vehicles.aggregate( [
            //                     {
            //                       $addFields: {
            //                           "specs.fuel_type": "unleaded"
            //                       }
            //                     }
            //               ] )
            //             */

            query("vehicles").addFields({
                "specs.fuel_type": "'unleaded'"
            },["unleaded"])
            // .pipeline
             .items()

Overwriting an existing field
    https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#overwriting-an-existing-field
        .. code-block::
            db.animals.insertMany([
                { _id: 1, dogs: 10, cats: 15 }
            ])

            /*
                db.animals.aggregate([
                  {
                    $addFields: { "cats": 20 }
                  }
                ])
            */

            query("animals").addFields({
                "cats": 20
            })
            .items()

