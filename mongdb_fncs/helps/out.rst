https://docs.mongodb.com/manual/reference/operator/aggregation/out/#example
    .. code-block::

         db.loadServerScripts()
        db.books.remove({})
        db.books.insert([
           { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
            { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
            { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
            { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
            { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
        ])

        /*

                        db.books.aggregate( [
                              { $group : { _id : "$author", books: { $push: "$title" } } },
                              { $out : "authors" }
                          ] )

        */
        var qr=query("books");
        qr.group({

            _id:"author",
            books:"push(title)"
        })
        .out("authors")