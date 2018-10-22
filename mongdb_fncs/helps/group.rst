https://docs.mongodb.com/manual/reference/operator/aggregation/group/#examples
    .. code-block::

        db.loadServerScripts();
        db.sales.remove({});
        db.sales.insertMany([
            { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-03-01T08:00:00Z") },
            { "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-03-01T09:00:00Z") },
            { "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-03-15T09:00:00Z") },
            { "_id" : 4, "item" : "xyz", "price" : 5, "quantity" : 20, "date" : ISODate("2014-04-04T11:21:39.736Z") },
            { "_id" : 5, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-04-04T21:23:13.331Z") }])

        /*
          db.sales.aggregate(
           [
              {
                $group : {
                   _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
                   totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
                   averageQuantity: { $avg: "$quantity" },
                   count: { $sum: 1 }
                }
              }
           ]
        )
        */

        query("sales").group({
            _id:{
                month:"month(date)",
                day:"dayOfMonth(date)",
                year:"year(date)"},
                averageQuantity: "avg(quantity)",
                count:"sum(1)"

        }).items()

Group by null
    https://docs.mongodb.com/manual/reference/operator/aggregation/group/#group-by-null
    .. code-block::

         db.loadServerScripts();
            db.sales.remove({});
            db.sales.insertMany([
                { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-03-01T08:00:00Z") },
                { "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-03-01T09:00:00Z") },
                { "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-03-15T09:00:00Z") },
                { "_id" : 4, "item" : "xyz", "price" : 5, "quantity" : 20, "date" : ISODate("2014-04-04T11:21:39.736Z") },
                { "_id" : 5, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-04-04T21:23:13.331Z") }])

            /*
              db.sales.aggregate(
               [
                  {
                    $group : {
                       _id : null,
                       totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
                       averageQuantity: { $avg: "$quantity" },
                       count: { $sum: 1 }
                    }
                  }
               ]
            )
            */

            query("sales").group({
                    _id:null,
                    averageQuantity: "avg(quantity)",
                    count:"sum(1)"

            }).items()

Pivot Data
    https://docs.mongodb.com/manual/reference/operator/aggregation/group/#pivot-data
        .. code-block::

            db.loadServerScripts();
            db.books.remove({});
            db.books.insertMany([
                { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
                { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
                { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
                { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
                { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
                ])

            /*
              db.books.aggregate(
                   [
                     { $group : { _id : "$author", books: { $push: "$title" } } }
                   ]
                )
            */

            query("books").group({
                _id:"author",
                books:"push(title)"

            }).items()
Group Documents and replace _id by group field name
    https://docs.mongodb.com/manual/reference/operator/aggregation/group/#group-documents-by-author
        .. code-block::

            db.loadServerScripts();
            db.books.remove({});
            db.books.insertMany([
                { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
                { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
                { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
                { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
                { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
                ])

            /*
              db.books.aggregate(
                   [
                     { $group : { _id : "$author", books: { $push: "$$ROOT" } } }
                   ]
                )
            */

            query("books").group({
                _id:"author",
                books:"push({0})"

            },'$$ROOT').items()