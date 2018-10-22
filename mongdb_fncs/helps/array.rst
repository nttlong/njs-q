7.1 setDifference:
        https://docs.mongodb.com/manual/reference/operator/aggregation/setDifference/#example
            .. code-block::

                db.loadServerScripts()

                db.experiments.drop()
                db.experiments.insertMany([
                            { "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] },
                            { "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] },
                            { "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] },
                            { "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] },
                            { "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] },
                            { "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] },
                            { "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] },
                            { "_id" : 8, "A" : [ ], "B" : [ ] },
                            { "_id" : 9, "A" : [ ], "B" : [ "red" ] }
                    ])
                /*
                    db.experiments.aggregate(
                       [
                         { $project: { A: 1, B: 1, inBOnly: { $setDifference: [ "$B", "$A" ] }, _id: 0 } }
                       ]
                    )
                */


                query("experiments").project({

                    A:1,
                    B:1,
                    inBOnly:"setDifference(B,A)",
                    _id:0


                })
                .items()

7.2 setEquals:
        https://docs.mongodb.com/manual/reference/operator/aggregation/setEquals/#example
            .. code-block::

                   db.loadServerScripts()

                    db.experiments.drop()
                    db.experiments.insertMany([
                                { "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] },
                                { "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] },
                                { "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] },
                                { "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] },
                                { "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] },
                                { "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] },
                                { "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] },
                                { "_id" : 8, "A" : [ ], "B" : [ ] },
                                { "_id" : 9, "A" : [ ], "B" : [ "red" ] }
                        ])
                    /*
                        db.experiments.aggregate(
                           [
                             { $project: { A: 1, B: 1, sameElements: { $setEquals: [ "$A", "$B" ] }, _id: 0 } }
                           ]
                        )
                    */


                    query("experiments").project({

                        A:1,
                        B:1,
                        sameElements:"setEquals(B,A)",
                        _id:0


                    })
                    .items()

7.3 setIntersection:
        https://docs.mongodb.com/manual/reference/operator/aggregation/setIntersection/#example
            .. code-block::

                db.loadServerScripts()

                db.experiments.drop()
                db.experiments.insertMany([
                            { "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] },
                            { "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] },
                            { "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] },
                            { "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] },
                            { "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] },
                            { "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] },
                            { "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] },
                            { "_id" : 8, "A" : [ ], "B" : [ ] },
                            { "_id" : 9, "A" : [ ], "B" : [ "red" ] }
                    ])
                /*
                    db.experiments.aggregate(
                       [
                         { $project: { A: 1, B: 1, commonToBoth: { $setIntersection: [ "$A", "$B" ] }, _id: 0 } }
                       ]
                    )
                */


                query("experiments").project({

                    A:1,
                    B:1,
                    commonToBoth:"setIntersection(B,A)",
                    _id:0


                })
                .items()

7.4 setIsSubset:
        https://docs.mongodb.com/manual/reference/operator/aggregation/setIsSubset/#example:
            .. code-block::

                db.loadServerScripts()

                db.experiments.drop()
                db.experiments.insertMany([
                            { "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] },
                            { "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] },
                            { "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] },
                            { "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] },
                            { "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] },
                            { "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] },
                            { "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] },
                            { "_id" : 8, "A" : [ ], "B" : [ ] },
                            { "_id" : 9, "A" : [ ], "B" : [ "red" ] }
                    ])
                /*
                    db.experiments.aggregate(
                       [
                         { $project: { A:1, B: 1, AisSubset: { $setIsSubset: [ "$A", "$B" ] }, _id:0 } }
                       ]
                    )
                */


                query("experiments").project({

                    A:1,
                    B:1,
                    AisSubset:"setIsSubset(B,A)",
                    _id:0


                })
                .items()

7.5 setUnion:
        https://docs.mongodb.com/manual/reference/operator/aggregation/setUnion/#example
            .. code-block::

                db.loadServerScripts()

                db.experiments.drop()
                db.experiments.insertMany([
                            { "_id" : 1, "A" : [ "red", "blue" ], "B" : [ "red", "blue" ] },
                            { "_id" : 2, "A" : [ "red", "blue" ], "B" : [ "blue", "red", "blue" ] },
                            { "_id" : 3, "A" : [ "red", "blue" ], "B" : [ "red", "blue", "green" ] },
                            { "_id" : 4, "A" : [ "red", "blue" ], "B" : [ "green", "red" ] },
                            { "_id" : 5, "A" : [ "red", "blue" ], "B" : [ ] },
                            { "_id" : 6, "A" : [ "red", "blue" ], "B" : [ [ "red" ], [ "blue" ] ] },
                            { "_id" : 7, "A" : [ "red", "blue" ], "B" : [ [ "red", "blue" ] ] },
                            { "_id" : 8, "A" : [ ], "B" : [ ] },
                            { "_id" : 9, "A" : [ ], "B" : [ "red" ] }
                    ])
                /*
                    db.experiments.aggregate(
                       [
                         { $project: { A:1, B: 1, allValues: { $setUnion: [ "$A", "$B" ] }, _id: 0 } }
                       ]
                    )
                */


                query("experiments").project({

                    A:1,
                    B:1,
                    allValues:"setUnion(B,A)",
                    _id:0


                })
                .items()

7.6 size:
        https://docs.mongodb.com/manual/reference/operator/aggregation/size/#example
            .. code-block::

                db.loadServerScripts()

                db.inventory.drop()
                db.inventory.insertMany([
                            { "_id" : 1, "item" : "ABC1", "description" : "product 1", colors: [ "blue", "black", "red" ] },
                            { "_id" : 2, "item" : "ABC2", "description" : "product 2", colors: [ "purple" ] },
                            { "_id" : 3, "item" : "XYZ1", "description" : "product 3", colors: [ ] }
                    ])
                /*
                   db.inventory.aggregate(
                       [
                          {
                             $project: {
                                item: 1,
                                numberOfColors: { $size: "$colors" }
                             }
                          }
                       ]
                    )
                */


                query("inventory").project({

                    item:1,
                    numberOfColors:"size(colors)"


                })
                .items()

7.7 slice:
        https://docs.mongodb.com/manual/reference/operator/aggregation/slice/#example:
            ..  code-block::

                db.loadServerScripts()

                db.users.drop()
                db.users.insertMany([
                            { "_id" : 1, "name" : "dave123", favorites: [ "chocolate", "cake", "butter", "apples" ] },
                            { "_id" : 2, "name" : "li", favorites: [ "apples", "pudding", "pie" ] },
                            { "_id" : 3, "name" : "ahn", favorites: [ "pears", "pecans", "chocolate", "cherries" ] },
                            { "_id" : 4, "name" : "ty", favorites: [ "ice cream" ] }
                    ])
                /*
                   db.users.aggregate([
                        { $project: { name: 1, threeFavorites: { $slice: [ "$favorites", 3 ] } } }
                    ])
                */


                query("users").project({

                    name:1,
                    threeFavorites:"slice(favorites,3)"


                })
                .items()
