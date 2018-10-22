https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/#example
    .. code-block::

        db.loadServerScripts();
        db.artwork.remove({});
        db.artwork.insertMany([
          { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,
            "price" : NumberDecimal("199.99"),
            "dimensions" : { "height" : 39, "width" : 21, "units" : "in" } },
        { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,
            "price" : NumberDecimal("280.00"),
            "dimensions" : { "height" : 49, "width" : 32, "units" : "in" } },
        { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,
            "price" : NumberDecimal("76.04"),
            "dimensions" : { "height" : 25, "width" : 20, "units" : "in" } },
        { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai",
            "price" : NumberDecimal("167.30"),
            "dimensions" : { "height" : 24, "width" : 36, "units" : "in" } },
        { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,
            "price" : NumberDecimal("483.00"),
            "dimensions" : { "height" : 20, "width" : 24, "units" : "in" } },
        { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,
            "price" : NumberDecimal("385.00"),
            "dimensions" : { "height" : 30, "width" : 46, "units" : "in" } },
        { "_id" : 7, "title" : "The Scream", "artist" : "Munch",
            "price" : NumberDecimal("159.00"),
            "dimensions" : { "height" : 24, "width" : 18, "units" : "in" } },
        { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,
            "price" : NumberDecimal("118.42"),
            "dimensions" : { "height" : 24, "width" : 20, "units" : "in" } }


            ])

        /*
          db.artwork.aggregate( [
           {
             $bucketAuto: {
                 groupBy: "$price",
                 buckets: 4
             }
           }
        ] )
        */
        query("artwork").bucketAuto({
            groupBy:"price",
            buckets:4
        })

        .items()

Multi-Faceted Aggregation
    https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/#multi-faceted-aggregation
        .. code-block::

              db.loadServerScripts()
                db.artwork.remove({});
                db.artwork.insertMany([
                  { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,
                    "price" : NumberDecimal("199.99"),
                    "dimensions" : { "height" : 39, "width" : 21, "units" : "in" } },
                { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,
                    "price" : NumberDecimal("280.00"),
                    "dimensions" : { "height" : 49, "width" : 32, "units" : "in" } },
                { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,
                    "price" : NumberDecimal("76.04"),
                    "dimensions" : { "height" : 25, "width" : 20, "units" : "in" } },
                { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai",
                    "price" : NumberDecimal("167.30"),
                    "dimensions" : { "height" : 24, "width" : 36, "units" : "in" } },
                { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,
                    "price" : NumberDecimal("483.00"),
                    "dimensions" : { "height" : 20, "width" : 24, "units" : "in" } },
                { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,
                    "price" : NumberDecimal("385.00"),
                    "dimensions" : { "height" : 30, "width" : 46, "units" : "in" } },
                { "_id" : 7, "title" : "The Scream", "artist" : "Munch",
                    "price" : NumberDecimal("159.00"),
                    "dimensions" : { "height" : 24, "width" : 18, "units" : "in" } },
                { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,
                    "price" : NumberDecimal("118.42"),
                    "dimensions" : { "height" : 24, "width" : 20, "units" : "in" } }


                    ])

                /*
                  db.artwork.aggregate( [
                  {
                    $facet: {
                      "price": [
                        {
                          $bucketAuto: {
                            groupBy: "$price",
                            buckets: 4
                          }
                        }
                      ],
                      "year": [
                        {
                          $bucketAuto: {
                            groupBy: "$year",
                            buckets: 3,
                            output: {
                              "count": { $sum: 1 },
                              "years": { $push: "$year" }
                            }
                          }
                        }
                      ],
                      "area": [
                        {
                          $bucketAuto: {
                            groupBy: {
                              $multiply: [ "$dimensions.height", "$dimensions.width" ]
                            },
                            buckets: 4,
                            output: {
                              "count": { $sum: 1 },
                              "titles": { $push: "$title" }
                            }
                          }
                        }
                      ]
                    }
                  }
                ] )
                */

                query("artwork").facet({
                    price:query().bucketAuto({
                        groupBy:"price",
                        buckets:4
                    }),
                    year:query().bucketAuto({
                        groupBy:'year',
                        buckets:3,
                        output:{
                            count:"sum(1)",
                            year:"push(year)"
                        }
                    }),
                    area:query().bucketAuto({
                        groupBy:"dimensions.height*dimensions.width",
                        buckets:4,
                        output:{
                            count:"sum(1)",
                            titles:"push(title)"
                        }
                    })
                })
                .items()