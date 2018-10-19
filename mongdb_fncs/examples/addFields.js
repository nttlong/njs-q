use test001
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
    _id:"$author",
    books:"$push($$ROOT)"
    
}).items()
