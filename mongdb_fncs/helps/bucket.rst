https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/#example
    .. code-block::

        db.loadServerScripts();
        db.artwork.remove({})
        db.artwork.insertMany([
          { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,
                "price" : NumberDecimal("199.99") },
            { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,
                "price" : NumberDecimal("280.00") },
            { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,
                "price" : NumberDecimal("76.04") },
            { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai",
                "price" : NumberDecimal("167.30") },
            { "_id" : 5, "title" : "The Persistence ,of Memory", "artist" : "Dali", "year" : 1931,
                "price" : NumberDecimal("483.00") },
            { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,
                "price" : NumberDecimal("385.00") },
            { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893
                /* No price*/ },
            { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,
                "price" : NumberDecimal("118.42") }
            ])

        /*
            db.artwork.aggregate( [
              {
                $bucket: {
                  groupBy: "$price",
                  boundaries: [ 0, 200, 400 ],
                  default: "Other",
                  output: {
                    "count": { $sum: 1 },
                    "titles" : { $push: "$title" }
                  }
                }
              }
            ] )
        */
         //console.log({x:"$push($title)"} instanceof Object)
        query("artwork").bucket({
            groupBy: "$price",
            boundaries: [ 0, 200, 400 ],
            default: "'Other'",
            output:{
                count:"sum(1)",
                titles:"push(title)"
            }
        }).items()
Using $bucket with $facet
    https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/#using-bucket-with-facet
        .. code-block::

            db.loadServerScripts();
            db.artwork.remove({});
            db.artwork.insertMany([
              { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,
                "price" : NumberDecimal("199.99") },
            { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,
                "price" : NumberDecimal("280.00") },
            { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,
                "price" : NumberDecimal("76.04") },
            { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai",
                "price" : NumberDecimal("167.30") },
            { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,
                "price" : NumberDecimal("483.00") },
            { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,
                "price" : NumberDecimal("385.00") },
            { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893
                /* No price*/ },
            { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,
                "price" : NumberDecimal("118.42") }


                ])

            /*
              db.artwork.aggregate( [
              {
                $facet: {
                  "price": [
                    {
                      $bucket: {
                          groupBy: "$price",
                          boundaries: [ 0, 200, 400 ],
                          default: "Other",
                          output: {
                            "count": { $sum: 1 },
                            "artwork" : { $push: { "title": "$title", "price": "$price" } }
                          }
                      }
                    }
                  ],
                  "year": [
                    {
                      $bucket: {
                        groupBy: "$year",
                        boundaries: [ 1890, 1910, 1920, 1940 ],
                        default: "Unknown",
                        output: {
                          "count": { $sum: 1 },
                          "artwork": { $push: { "title": "$title", "year": "$year" } }
                        }
                      }
                    }
                  ]
                }
              }
            ] )
            */

            query("artwork").facet({
               price:query().bucket({
                   groupBy:"price",
                   boundaries:[0,200,400],
                   default: "'Other'",
                   output:{
                       count:"sum(1)",
                       artwork:"push({0})"
                   }
               },query().parse({ title: "title", year: "year" })),
               year:query().bucket({
                   groupBy: "year",
                   boundaries: [ 1890, 1910, 1920, 1940 ],
                   default: "'Unknown'",
                   output:{
                       count:"sum(1)",
                       artwork:"push({0})"
                   }
               },query().parse({ title: "title", year: "year" }))
            }).items()
