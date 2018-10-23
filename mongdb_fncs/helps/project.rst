12.1 Include Specific Fields in Output Documents
    https://docs.mongodb.com/manual/reference/operator/aggregation/project/#include-specific-fields-in-output-documents
        .. code-block::

            db.loadServerScripts()
            db.books.remove({})
            db.books.insert([
                   {
                  "_id" : 1,
                  title: "abc123",
                  isbn: "0001122223334",
                  author: { last: "zzz", first: "aaa" },
                  copies: 5
                }
            ])

            /*

                           db.books.aggregate( [ { $project : { title : 1 , author : 1 } } ] )

            */
            query("books").project({

                title : 1 , author : 1
            }).items()

12.2 Suppress _id Field in the Output Documents
    https://docs.mongodb.com/manual/reference/operator/aggregation/project/#suppress-id-field-in-the-output-documents
        .. code-block::

            db.loadServerScripts()
            db.books.remove({})
            db.books.insert([
                   {
                  "_id" : 1,
                  title: "abc123",
                  isbn: "0001122223334",
                  author: { last: "zzz", first: "aaa" },
                  copies: 5
                }
            ])

            /*

                           db.books.aggregate( [ { $project : { _id: 0, title : 1 , author : 1 } } ] )

            */
            query("books").project({

                _id:0,title : 1 , author : 1
            }).items()

12.3 Exclude Fields from Output Documents
    https://docs.mongodb.com/manual/reference/operator/aggregation/project/#exclude-fields-from-output-documents
        .. code-block::

            db.loadServerScripts()
            db.books.remove({})
            db.books.insert([
                  {
                  "_id" : 1,
                  title: "abc123",
                  isbn: "0001122223334",
                  author: { last: "zzz", first: "aaa" },
                  copies: 5,
                  lastModified: "2016-07-28"
                }
            ])

            /*

                          db.books.aggregate( [ { $project : { "lastModified": 0 } } ] )

            */
            query("books").project({

                lastModified:0
            }).items()

12.4 Conditionally Exclude Fields:
        https://docs.mongodb.com/manual/reference/operator/aggregation/project/#exclude-fields-from-output-documents
            .. code-block::

                db.loadServerScripts()
                db.books.remove({})
                db.books.insert([
                     {
                      "_id" : 1,
                      title: "abc123",
                      isbn: "0001122223334",
                      author: { last: "zzz", first: "aaa" },
                      copies: 5,
                      lastModified: "2016-07-28"
                    },
                    {
                      "_id" : 2,
                      title: "Baked Goods",
                      isbn: "9999999999999",
                      author: { last: "xyz", first: "abc", middle: "" },
                      copies: 2,
                      lastModified: "2017-07-21"
                    },
                    {
                      "_id" : 3,
                      title: "Ice Cream Cakes",
                      isbn: "8888888888888",
                      author: { last: "xyz", first: "abc", middle: "mmm" },
                      copies: 5,
                      lastModified: "2017-07-22"
                    }
                ])

                /*

                              db.books.aggregate( [
                               {
                                  $project: {
                                     title: 1,
                                     "author.first": 1,
                                     "author.last" : 1,
                                     "author.middle": {
                                        $cond: {
                                           if: { $eq: [ "", "$author.middle" ] },
                                           then: "$$REMOVE",
                                           else: "$author.middle"
                                        }
                                     }
                                  }
                               }
                            ] )

                */
                query("books").project({
                    title:1,
                    "author.first": 1,
                    "author.last" : 1,
                    "author.middle":"iif(author.middle=='',$REMOVE,author.middle)"
                }).items()

12.5 Include Specific Fields from Embedded Documents
        https://docs.mongodb.com/manual/reference/operator/aggregation/project/#include-specific-fields-from-embedded-documents
            .. code-block::

                db.loadServerScripts()
                db.bookmarks.remove({})
                db.bookmarks.insert([
                    { _id: 1, user: "1234", stop: { title: "book1", author: "xyz", page: 32 } },
                    { _id: 2, user: "7890", stop: [ { title: "book2", author: "abc", page: 5 }, { title: "book3", author: "ijk", page: 100 } ] }
                ])

                /*

                             db.bookmarks.aggregate( [ { $project: { stop: { title: 1 } } } ] )

                */
                query("bookmarks").project({
                    stop: { title: 1 }
                }).items()

12.6 Include Computed Fields
        https://docs.mongodb.com/manual/reference/operator/aggregation/project/#include-computed-fields
            .. code-block::

                db.loadServerScripts()
                db.books.remove({})
                db.books.insert([
                    {
                  "_id" : 1,
                  title: "abc123",
                  isbn: "0001122223334",
                  author: { last: "zzz", first: "aaa" },
                  copies: 5
                }
                ])

                /*

                            db.books.aggregate(
                           [
                              {
                                 $project: {
                                    title: 1,
                                    isbn: {
                                       prefix: { $substr: [ "$isbn", 0, 3 ] },
                                       group: { $substr: [ "$isbn", 3, 2 ] },
                                       publisher: { $substr: [ "$isbn", 5, 4 ] },
                                       title: { $substr: [ "$isbn", 9, 3 ] },
                                       checkDigit: { $substr: [ "$isbn", 12, 1] }
                                    },
                                    lastName: "$author.last",
                                    copiesSold: "$copies"
                                 }
                              }
                           ]
                        )

                */
                query("books").project({
                    title: 1,
                    isbn:{
                        prefix:"substr(isbn,0,3)",
                        group:"substr(isbn, 3, 2)",
                        publisher:"substr(isbn,5,4)",
                        title:'substr(isbn, 9, 3)',
                        checkDigit:"substr(isbn,12,1)",
                        lastName:"author.last",
                        copiesSold:"copies"
                    }
                }).items()

12.7 Project New Array Fields:
    https://docs.mongodb.com/manual/reference/operator/aggregation/project/#project-new-array-fields
        .. code-block::

            db.loadServerScripts()
            db.test.remove({})
            db.test.insert([
               { "_id" : ObjectId("55ad167f320c6be244eb3b95"), "x" : 1, "y" : 1 }
            ])

            /*

                       db.test.aggregate( [ { $project: { myArray: [ "$x", "$y" ] } } ] )

            */
            query("test").project({
                myArray: ["x","y"]
            }).items()