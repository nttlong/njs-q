14.1 replaceRoot with an embedded document:
    https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/#replaceroot-with-an-embedded-document
        .. code-block::

            db.loadServerScripts()
            db.produce.remove({})
            db.produce.insert([
              {
               "_id" : 1,
               "fruit" : [ "apples", "oranges" ],
               "in_stock" : { "oranges" : 20, "apples" : 60 },
               "on_order" : { "oranges" : 35, "apples" : 75 }
            },
            {
               "_id" : 2,
               "vegetables" : [ "beets", "yams" ],
               "in_stock" : { "beets" : 130, "yams" : 200 },
               "on_order" : { "beets" : 90, "yams" : 145 }
            }
            ])

            /*

                      db.produce.aggregate( [
                       {
                         $replaceRoot: { newRoot: "$in_stock" }
                       }
                    ] )

            */
            query("produce").replaceRoot("in_stock")
            .items()
14.2 replaceRoot with a $match stage:
    https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/#replaceroot-with-a-match-stage
        .. code-block::

            db.loadServerScripts()
            db.people.remove({})
            db.people.insert([
              { "_id" : 1, "name" : "Arlene", "age" : 34, "pets" : { "dogs" : 2, "cats" : 1 } },
                { "_id" : 2, "name" : "Sam", "age" : 41, "pets" : { "cats" : 1, "hamsters" : 3 } },
                { "_id" : 3, "name" : "Maria", "age" : 25 }
            ])

            /*

                     db.people.aggregate( [
                       {
                         $match: { pets : { $exists: true } }
                       },
                       {
                         $replaceRoot: { newRoot: "$pets" }
                       }
                    ] )
            */
            query("people")
            .match("exists(pets)")
            .replaceRoot("pets")
            .items()

14.3 replaceRoot with a newly created document:
        https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/#replaceroot-with-a-newly-created-document
         .. code-block::

                db.loadServerScripts()
                db.contacts.remove({})
                db.contacts.insert([
                    { "_id" : 1, "first_name" : "Gary", "last_name" : "Sheffield", "city" : "New York" },
                    { "_id" : 2, "first_name" : "Nancy", "last_name" : "Walker", "city" : "Anaheim" },
                    { "_id" : 3, "first_name" : "Peter", "last_name" : "Sumner", "city" : "Toledo" }
                ])

                /*

                    db.contacts.aggregate( [
                       {
                          $replaceRoot: {
                             newRoot: {
                                full_name: {
                                   $concat : [ "$first_name", " ", "$last_name" ]
                                }
                             }
                          }
                       }
                    ] )
                */
                query("contacts")
                .replaceRoot({
                    full_name:"concat(first_name,' ',last_name)"
                })
                .items()
14.4 replaceRoot with an array element
    https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/#replaceroot-with-an-array-element
        .. code-block::

            db.loadServerScripts()
            db.contacts.remove({})
            db.contacts.insert([
                { "_id" : 1, "name" : "Susan",
              "phones" : [ { "cell" : "555-653-6527" },
                           { "home" : "555-965-2454" } ] },
            { "_id" : 2, "name" : "Mark",
              "phones" : [ { "cell" : "555-445-8767" },
                           { "home" : "555-322-2774" } ] }
            ])

            /*

               db.contacts.aggregate( [
               {
                  $unwind: "$phones"
               },
               {
                  $match: { "phones.cell" : { $exists: true } }
               },
               {
                  $replaceRoot: { newRoot: "$phones"}
               }
            ] )
            */
            query("contacts")
            .unwind("phones")
            .match("exists(phones.cell)")
            .replaceRoot("phones")
            .items()