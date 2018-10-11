1- addFields:
    https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/

    .. code-block::

             var scores=coll.coll("main","scores");
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


2- bucket:
    https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/
    .. code-block::

        var data=[
            { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,"price" : 199.99 },
            { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,"price" : 280.00 },
            { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,   "price" : 76.04 },
            { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai", "price" :167.30 },
            { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931, "price" : 483.00},
            { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913, "price" : 385.00 },
            { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893    /* No price*/ },
            { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918, "price" :118.42 }
        ];

         var artwork=coll.coll("main","artwork");
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
         var qr=artwork.aggregate().bucket({
            groupBy:"price",
            boundaries:[0,200,400],
            default:"{0}",
            output:{
                count:"sum(1)",
                titles:"push(title)"
            }},"Others");
        console.log(JSON.stringify(qr.__pipe));
        var items=qr.items();
        console.log(JSON.stringify(items));

3 - bucketAuto
    https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/

    .. code-block::

        var data=[
                {
                    "_id" : 1,
                    "title" : "The Pillars of Society",
                    "artist" : "Grosz",
                    "year" : 1926,
                    "price" : 199.99,
                    "dimensions" : { "height" : 39, "width" : 21, "units" : "in" }
                },
                {
                     "_id" : 2,
                     "title" : "Melancholy III",
                      "artist" : "Munch",
                      "year" : 1902,
                      "price" : 280.00,
                      "dimensions" : { "height" : 49, "width" : 32, "units" : "in" }
                    },
                    {
                        "_id" : 3,
                        "title" : "Dancer",
                        "artist" : "Miro",
                        "year" : 1925,
                        "price" : 76.04,
                        "dimensions" : { "height" : 25, "width" : 20, "units" : "in" }
                    },
                    {
                         "_id" : 4,
                         "title" : "The Great Wave off Kanagawa",
                          "artist" : "Hokusai",
                          "price" : 167.30,
                          "dimensions" : { "height" : 24, "width" : 36, "units" : "in" }
                        },
                    {
                         "_id" : 5,
                         "title" : "The Persistence of Memory",
                         "artist" : "Dali",
                          "year" : 1931,
                          "price" :483.00,
                          "dimensions" : { "height" : 20, "width" : 24, "units" : "in" }
                        },
                        {
                            "_id" : 6,
                            "title" : "Composition VII",
                            "artist" : "Kandinsky",
                             "year" : 1913,
                             "price" : 385.00,
                             "dimensions" : { "height" : 30, "width" : 46, "units" : "in" } },
                       {
                           "_id" : 7,
                            "title" : "The Scream",
                            "artist" : "Munch",
                            "price" : 159.00,
                            "dimensions" : { "height" : 24, "width" : 18, "units" : "in" }
                        },
                        {
                             "_id" : 8,
                              "title" : "Blue Flower",
                              "artist" : "O'Keefe",
                              "year" : 1918,
                              "price" :118.42,
                              "dimensions" : { "height" : 24, "width" : 20, "units" : "in" } }
            ];

             var artwork=coll.coll("main","artwork-2");
            //  artwork.insert(data).commit();
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
             var qr=artwork.aggregate().bucketAuto({
                groupBy:"price",
                buckets:2
             });


            console.log(JSON.stringify(qr.__pipe));
            var items=qr.items();
            console.log(JSON.stringify(items));
4- facet:
    https://docs.mongodb.com/manual/reference/operator/aggregation/facet/

    .. code-block::

        coll.db("main","mongodb://root:123456@localhost:27017/hrm");
        var data=[
            { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926, "price" :199.99,
                "tags" : [ "painting", "satire", "Expressionism", "caricature" ] },
          { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,"price" :280.00,
              "tags" : [ "woodcut", "Expressionism" ] },
          { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,"price" :76.04,
              "tags" : [ "oil", "Surrealism", "painting" ] },
          { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai","price" :167.30,
              "tags" : [ "woodblock", "ukiyo-e" ] },
          { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,"price" : 483.00,
               "tags" : [ "Surrealism", "painting", "oil" ] },
          { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913, "price" :385.00,
              "tags" : [ "oil", "painting", "abstract" ] },
          { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893,
            "tags" : [ "Expressionism", "painting", "oil" ] },
          { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,"price" : 118.42,
            "tags" : [ "abstract", "painting" ] }
        ];

         var artwork=coll.coll("main","artwork-3");
        //   artwork.insert(data).commit();
         /*
                db.artwork.aggregate( [
                {
                    $facet: {
                    "categorizedByTags": [
                        { $unwind: "$tags" },
                        { $sortByCount: "$tags" }
                    ],
                    "categorizedByPrice": [
                        // Filter out documents without a price e.g., _id: 7
                        { $match: { price: { $exists: 1 } } },
                        {
                        $bucket: {
                            groupBy: "$price",
                            boundaries: [  0, 150, 200, 300, 400 ],
                            default: "Other",
                            output: {
                            "count": { $sum: 1 },
                            "titles": { $push: "$title" }
                            }
                        }
                        }
                    ],
                    "categorizedByYears(Auto)": [
                        {
                        $bucketAuto: {
                            groupBy: "$year",
                            buckets: 4
                        }
                        }
                    ]
                    }
                }
                ])

          */
         var qr=artwork.aggregate()
         qr.facet({
            categorizedByTags:qr.stages().unwind("tags").sortByCount("tags"),
            categorizedByPrice:qr.stages().match("exist(price)").bucket({
                groupBy:"price",
                boundaries:[  0, 150, 200, 300, 400 ],
                default:"{0}",
                output:{
                    count:"sum(1)",
                    titles:"push(title)"
                }
            },"Other"),
            "categorizedByYears(Auto)":qr.stages().bucketAuto({groupBy:"year",buckets:4})
         });


        console.log(JSON.stringify(qr.__pipe));
        var items=qr.items();
        console.log(JSON.stringify(items));
