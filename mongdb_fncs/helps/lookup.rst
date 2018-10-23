9.1 Equality Match
    In SQL:
        .. code-block::

                SELECT *, <output array field>
                FROM collection
                WHERE <output array field> IN (SELECT *
                                               FROM <collection to join>
                                               WHERE <foreignField>= <collection.localField>);

    This example in official Mongodb:
        https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#examples
        can rewrite like bellow example:

     .. code-block::

        db.loadServerScripts()
        db.orders.remove({})
        db.orders.insert([
           { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
           { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
           { "_id" : 3  }
        ])
        db.inventory.remove({})
        db.inventory.insert([
           { "_id" : 1, "sku" : "almonds", description: "product 1", "instock" : 120 },
           { "_id" : 2, "sku" : "bread", description: "product 2", "instock" : 80 },
           { "_id" : 3, "sku" : "cashews", description: "product 3", "instock" : 60 },
           { "_id" : 4, "sku" : "pecans", description: "product 4", "instock" : 70 },
           { "_id" : 5, "sku": null, description: "Incomplete" },
           { "_id" : 6 }
        ])

        /*

        db.orders.aggregate([
           {
             $lookup:
               {
                 from: "inventory",
                 localField: "item",
                 foreignField: "sku",
                 as: "inventory_docs"
               }
          }
        ])

        */

        query("orders").lookup("inventory","item","sku","inventory_docs").items()

9.2 Use $lookup with an Array:
    https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#use-lookup-with-an-array
        .. code-block::

            db.loadServerScripts()
            db.orders.remove({})
            db.orders.insert([
              { "_id" : 1, "item" : "MON1003", "price" : 350, "quantity" : 2, "specs" :
                [ "27 inch", "Retina display", "1920x1080" ],
                "type" : "Monitor"

              }
            ])
            db.inventory.remove({})
            db.inventory.insert([
               { "_id" : 1, "sku" : "MON1003", "type" : "Monitor", "instock" : 120,"size" : "27 inch", "resolution" : "1920x1080" },
                { "_id" : 2, "sku" : "MON1012", "type" : "Monitor", "instock" : 85,"size" : "23 inch", "resolution" : "1280x800" },
                { "_id" : 3, "sku" : "MON1031", "type" : "Monitor", "instock" : 60,"size" : "23 inch", "display_type" : "LED" }
            ])

            /*

            db.orders.aggregate([
               {
                  $unwind: "$specs"
               },
               {
                  $lookup:
                     {
                        from: "inventory",
                        localField: "specs",
                        foreignField: "size",
                        as: "inventory_docs"
                    }
               },
               {
                  $match: { "inventory_docs": { $ne: [] } }
               }
            ])

            */

            query("orders").unwind("specs").lookup("inventory","specs","size","inventory_docs").items()

9.3 Use $lookup with $mergeObjects
    https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#use-lookup-with-mergeobjects
        .. code-block::

            db.loadServerScripts()
            db.orders.remove({})
            db.orders.insert([
               { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
               { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
            ])
            db.items.remove({})
            db.items.insert([
              { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
              { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
              { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
            ])

            /*

            db.orders.aggregate([
               {
                  $lookup: {
                     from: "items",
                     localField: "item",    // field in the orders collection
                     foreignField: "item",  // field in the items collection
                     as: "fromItems"
                  }
               },
               {
                  $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
               },
               { $project: { fromItems: 0 } }
            ])

            */

            query("orders")
            //.parse("mergeObjects(arrayElemAt(fromItems),{0})", ["$$ROOT"])
            .lookup("items","item","item","fromItems")
            .replaceRoot("mergeObjects(arrayElemAt(fromItems,0),{0})", "$$ROOT" )
            .project({fromItems:0})
            .items()

9.3 Specify Multiple Join Conditions with $lookup
    https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#specify-multiple-join-conditions-with-lookup
        .. code-block::

            db.loadServerScripts()
            db.orders.remove({})
            db.orders.insert([
              { "_id" : 1, "item" : "almonds", "price" : 12, "ordered" : 2 },
              { "_id" : 2, "item" : "pecans", "price" : 20, "ordered" : 1 },
              { "_id" : 3, "item" : "cookies", "price" : 10, "ordered" : 60 }
            ])
            db.warehouses.remove({})
            db.warehouses.insert([
              { "_id" : 1, "stock_item" : "almonds", warehouse: "A", "instock" : 120 },
              { "_id" : 2, "stock_item" : "pecans", warehouse: "A", "instock" : 80 },
              { "_id" : 3, "stock_item" : "almonds", warehouse: "B", "instock" : 60 },
              { "_id" : 4, "stock_item" : "cookies", warehouse: "B", "instock" : 40 },
              { "_id" : 5, "stock_item" : "cookies", warehouse: "A", "instock" : 80 }
            ])

            /*

            db.orders.aggregate([
               {
                  $lookup:
                     {
                       from: "warehouses",
                       let: { order_item: "$item", order_qty: "$ordered" },
                       pipeline: [
                          { $match:
                             { $expr:
                                { $and:
                                   [
                                     { $eq: [ "$stock_item",  "$$order_item" ] },
                                     { $gte: [ "$instock", "$$order_qty" ] }
                                   ]
                                }
                             }
                          },
                          { $project: { stock_item: 0, _id: 0 } }
                       ],
                       as: "stockdata"
                     }
                }
            ])

            */

            query("orders")
            .lookup({
                from:"warehouses",
                let:{order_item:"item",order_qty:"ordered"},
                pipeline:query().match("expr(stock_item==$order_item && instock>=$order_qty)").project({ stock_item: 0, _id: 0 }),
                as:"stockdata"
            })
            .items()

        In SQL the above example looks like this:
            .. code-block::

                SELECT *, stockdata
                FROM orders
                WHERE stockdata IN (SELECT warehouse, instock
                                    FROM warehouses
                                    WHERE stock_item= orders.item
                                    AND instock >= orders.ordered );

9.4 Uncorrelated Subquery:
    https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#uncorrelated-subquery
        .. code-block::

            db.loadServerScripts()
            db.absences.remove({})
            db.absences.insert([
               { "_id" : 1, "student" : "Ann Aardvark", sickdays: [ new Date ("2018-05-01"),new Date ("2018-08-23") ] },
               { "_id" : 2, "student" : "Zoe Zebra", sickdays: [ new Date ("2018-02-01"),new Date ("2018-05-23") ] },
            ])
            db.holidays.remove({})
            db.holidays.insert([
               { "_id" : 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
               { "_id" : 2, year: 2018, name: "Pi Day", date: new Date("2018-03-14") },
               { "_id" : 3, year: 2018, name: "Ice Cream Day", date: new Date("2018-07-15") },
               { "_id" : 4, year: 2017, name: "New Years", date: new Date("2017-01-01") },
               { "_id" : 5, year: 2017, name: "Ice Cream Day", date: new Date("2017-07-16") }
            ])

            /*

            db.absences.aggregate([
               {
                  $lookup:
                     {
                       from: "holidays",
                       pipeline: [
                          { $match: { year: 2018 } },
                          { $project: { _id: 0, date: { name: "$name", date: "$date" } } },
                          { $replaceRoot: { newRoot: "$date" } }
                       ],
                       as: "holidays"
                     }
                }
            ])

            */

            query("absences")
            .lookup({
                from:"holidays",

                pipeline:query().match("year==2018").project({_id:0,date:{name:"name",date:"date"} }).replaceRoot("date"),
                as:"holidays"
            })
            .items()

