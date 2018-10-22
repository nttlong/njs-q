6.1 strcasecmp:
    https://docs.mongodb.com/manual/reference/operator/aggregation/strcasecmp/#example
        .. code-block::

            db.loadServerScripts()
            db.inventory.drop()
            db.inventory.insertMany([
                        { "_id" : 1, "item" : "ABC1", quarter: "13Q1", "description" : "product 1" },
                        { "_id" : 2, "item" : "ABC2", quarter: "13Q4", "description" : "product 2" },
                        { "_id" : 3, "item" : "XYZ1", quarter: "14Q2", "description" : null }
                ])
            /*
                db.inventory.aggregate(
                   [
                     {
                       $project:
                          {
                            item: 1,
                            comparisonResult: { $strcasecmp: [ "$quarter", "13q4" ] }
                          }
                      }
                   ]
                )
            */


            query("inventory").project({

                item:1,
                comparisonResult:"strcasecmp(quarter,'13q4')"

            })
            .items()

6.2 strLenBytes:
    https://docs.mongodb.com/manual/reference/operator/aggregation/strLenBytes/#example
        .. code-block::

            db.loadServerScripts()
            db.food.drop()
            db.food.insertMany([
                        { "_id" : 1, "name" : "apple" },
                        { "_id" : 2, "name" : "banana" },
                        { "_id" : 3, "name" : "éclair" },
                        { "_id" : 4, "name" : "hamburger" },
                        { "_id" : 5, "name" : "jalapeño" },
                        { "_id" : 6, "name" : "pizza" },
                        { "_id" : 7, "name" : "tacos" },
                        { "_id" : 8, "name" : "寿司" }
                ])
            /*
                db.food.aggregate(
                  [
                    {
                      $project: {
                        "name": 1,
                        "length": { $strLenBytes: "$name" }
                      }
                    }
                  ]
                )
            */


            query("food").project({

                name:1,
                length:"strLenBytes(name)"

            })
            .items()

6.3 strLenCP:
    https://docs.mongodb.com/manual/reference/operator/aggregation/strLenCP/#example
        .. code-block::

                db.loadServerScripts()
                db.food.drop()
                db.food.insertMany([
                            { "_id" : 1, "name" : "apple" },
                            { "_id" : 2, "name" : "banana" },
                            { "_id" : 3, "name" : "éclair" },
                            { "_id" : 4, "name" : "hamburger" },
                            { "_id" : 5, "name" : "jalapeño" },
                            { "_id" : 6, "name" : "pizza" },
                            { "_id" : 7, "name" : "tacos" },
                            { "_id" : 8, "name" : "寿司" }
                    ])
                /*
                    db.food.aggregate(
                      [
                        {
                          $project: {
                            "name": 1,
                            "length": { $strLenCP: "$name" }
                          }
                        }
                      ]
                    )
                */


                query("food").project({

                    name:1,
                    length:"strLenCP(name)"

                })
                .items()
6.4 substr:
        substr(<fieldname or text value>,<start:int>,<end:int>)
            https://docs.mongodb.com/manual/reference/operator/aggregation/substr/#example
                .. code-block::

                    db.loadServerScripts()

                    db.inventory.drop()
                    db.inventory.insertMany([
                                { "_id" : 1, "item" : "ABC1", quarter: "13Q1", "description" : "product 1" },
                                { "_id" : 2, "item" : "ABC2", quarter: "13Q4", "description" : "product 2" },
                                { "_id" : 3, "item" : "XYZ1", quarter: "14Q2", "description" : null }
                        ])
                    /*
                        db.inventory.aggregate(
                           [
                             {
                               $project:
                                  {
                                    item: 1,
                                    yearSubstring: { $substr: [ "$quarter", 0, 2 ] },
                                    quarterSubtring: { $substr: [ "$quarter", 2, -1 ] }
                                  }
                              }
                           ]
                        )
                    */


                    query("inventory").project({

                        name:1,
                        yearSubstring:"substr(quarter,0,2)",
                        quarterSubtring:"substr(quarter,2,-1)"

                    })
                    .items()

6.5: substrBytes:
        substrBytes(<string expression>, <byte index>, <byte count>)
            https://docs.mongodb.com/manual/reference/operator/aggregation/substrBytes/#example
                .. code-block::

                    db.loadServerScripts()

                    db.inventory.drop()
                    db.inventory.insertMany([
                                { "_id" : 1, "item" : "ABC1", quarter: "13Q1", "description" : "product 1" },
                                { "_id" : 2, "item" : "ABC2", quarter: "13Q4", "description" : "product 2" },
                                { "_id" : 3, "item" : "XYZ1", quarter: "14Q2", "description" : null }
                        ])
                    /*
                        db.inventory.aggregate(
                          [
                            {
                              $project: {
                                item: 1,
                                yearSubstring: { $substrBytes: [ "$quarter", 0, 2 ] },
                                quarterSubtring: {
                                  $substrBytes: [
                                    "$quarter", 2, { $subtract: [ { $strLenBytes: "$quarter" }, 2 ] }
                                  ]
                                }
                              }
                            }
                          ]
                        )
                    */


                    query("inventory").project({

                        name:1,
                        yearSubstring:"substr(quarter,0,2)",
                        quarterSubtring:"substrBytes(quarter,2,strLenBytes(quarter)-2)"

                    })
                    .items()

6.6 substrCP:
        $substrCP(<string expression>, <code point index>, <code point count>)
            https://docs.mongodb.com/manual/reference/operator/aggregation/substrCP/#example
                .. code-block::

                    db.loadServerScripts()

                    db.inventory.drop()
                    db.inventory.insertMany([
                                { "_id" : 1, "item" : "ABC1", quarter: "13Q1", "description" : "product 1" },
                                { "_id" : 2, "item" : "ABC2", quarter: "13Q4", "description" : "product 2" },
                                { "_id" : 3, "item" : "XYZ1", quarter: "14Q2", "description" : null }
                        ])
                    /*
                        db.inventory.aggregate(
                          [
                            {
                              $project: {
                                item: 1,
                                yearSubstring: { $substrCP: [ "$quarter", 0, 2 ] },
                                quarterSubtring: {
                                  $substrCP: [
                                    "$quarter", 2, { $subtract: [ { $strLenCP: "$quarter" }, 2 ] }
                                  ]
                                }
                              }
                            }
                          ]
                        )
                    */


                    query("inventory").project({

                        name:1,
                        yearSubstring:"substrCP(quarter,0,2)",
                        quarterSubtring:"substrCP(quarter,2,strLenCP(quarter)-2)"

                    })
                    .items()

6.7 split:
        https://docs.mongodb.com/manual/reference/operator/aggregation/split/#example:
            .. code-block::

                db.loadServerScripts()

                db.deliveries.drop()
                db.deliveries.insertMany([
                            { "_id" : 1, "city" : "Berkeley, CA", "qty" : 648 },
                            { "_id" : 2, "city" : "Bend, OR", "qty" : 491 },
                            { "_id" : 3, "city" : "Kensington, CA", "qty" : 233 },
                            { "_id" : 4, "city" : "Eugene, OR", "qty" : 842 },
                            { "_id" : 5, "city" : "Reno, NV", "qty" : 655 },
                            { "_id" : 6, "city" : "Portland, OR", "qty" : 408 },
                            { "_id" : 7, "city" : "Sacramento, CA", "qty" : 574 }
                    ])
                /*
                   db.deliveries.aggregate([
                      { $project : { city_state : { $split: ["$city", ", "] }, qty : 1 } },
                      { $unwind : "$city_state" },
                      { $match : { city_state : /[A-Z]{2}/ } },
                      { $group : { _id: { "state" : "$city_state" }, total_qty : { "$sum" : "$qty" } } },
                      { $sort : { total_qty : -1 } }
                    ]);
                */


                query("deliveries").project({

                    city_state:"split(city,',')",
                    qty:1
                }).unwind("city_state")
                .group({
                    _id:{state:"city_state",total_qty:"sum(qty)"}
                })
                .sort({total_qty:-1})
                .items()