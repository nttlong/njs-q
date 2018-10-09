
q-coll
======

1- Setup connection:
    .. list-table:: db
       :widths: 25 25 50
       :header-rows: 1

       * - Params
         - Type
         - Description
       * - connection name
         - string
         - The name of connectio will be created
       * - url connection
         - string
         - uri to mongodb connection format type:

            "mongodb://<user>:<pass>@<host>:<port>/<database>


    Example:

    .. code-block::

        var coll=require("./q-coll");
        coll.db("main","mongodb://myuser:mypassword@myhost:27017/mydatabase");

2- Create queryable collection:
    .. list-table:: coll
        :widths: 25 25 10 40
        :header-rows: 1

        * -  Params
          -  Type
          -  Require
          -  Description
        * - db name or connection
          - string or require("mongodb").MongoClient
          - yes
          - Connection to mongodb it could be the name of connection has been set up by call db function
        * - collection name prefix
          - string
          - no
          - The prefix name of Mongodb collection will be manipulated
        * - Collection name
          - string
          - yes
          - The collection name

Example:

.. code-block::

    coll.db("main","mongodb://...:...@...:27017/...");
    var qr=coll.coll("main","collection1");
    var qr2=coll.coll("main","test","collection");


3- Find one item:
     .. list-table:: where and get one item
        :widths: 25 25 10 40
        :header-rows: 1

        * -  Params
          -  Type
          -  Require
          -  Description
        * - Expression
          - string
          - yes
          - The expression text describes filter. It will be translated into Mongodb expression
        * - Parameters
          - any
          - no
          - The parameters will be embeded into Mongodb expression

Example:

.. code-block::

    coll.db("main","mongodb://...:...@...:27017/...");
    var qr=coll.coll("main","collection1")
    qr.where("code=={0} and level=={1}","CodeFind",1);
    var item=qr.item();
    var item=qr.item() //sync call
     //async call
    qr.item(function(err,result){
          console.log(result);
    });


4- Get list of items match a conditional:
     .. list-table:: where and get list of items
        :widths: 25 25 10 40
        :header-rows: 1

        * -  Params
          -  Type
          -  Require
          -  Description
        * - Expression
          - string
          - yes
          - The expression text describes filter. It will be translated into Mongodb expression
        * - Parameters
          - any
          - no
          - The parameters will be embeded into Mongodb expression

Example:

.. code-block::

    coll.db("main","mongodb://...:...@...:27017/...");
    var qr=coll.coll("main","collection1")
    qr.where("code=={0} and level=={1}","CodeFind",1);
    var item=qr.items() //sync call
    //async call
    qr.items(function(err,result){
          console.log(result);
    });

5 - CRUD- CREATE, READ, UPDATE, DELETE
    5.1 - Insert one or many items:

    .. list-table:: insert then commit
        :widths: 25 25 10 40
        :header-rows: 1

        * -  Params
          -  Type
          -  Require
          -  Description
        * - Data insert
          -  json object
          -  yes
          -  The data will be insert when commit was called

    .. code-block::

        coll.db("main","mongodb://...:...@....:..../hrm");
        var qr=coll.coll("main","collection1");
        try {
            var r= qr.insert({code:"001",level:15}).commit() //sync call
            console.log(r);
        } catch (error) {
            console.error(error);
        }
        //asyn call
        qr.insert({code:"001",level:15}).commit(function(err,res){
            console.log(res);
            console.error(err);
        });

        try {
            //sync call
            var ret=qr.insert([
                {
                    code:"001",
                    level:15
                },{
                    code:"002",
                    level:29
                }
            ]).commit() ;
            console.log(ret);
        } catch (error) {
            console.error(error);
        }
        //async call
        qr.insert([
            {
                code:"001",
                level:15
            },{
                code:"002",
                level:29
            }
        ]).commit(function(e,r){
            console.log(r);
            console.log(e);
        }) ;


    5.2 Update:

        where, update then commit

        .. code-block::

            //sync call
            try {
                var result=qr.where("code=={0} and level=={1}","001",19).set({
                    level:20
                }).commit();
                console.log(result)
            } catch (error) {
                console.error(error);
            }
            //ascyn call
            var result=qr.where("code=={0} and level=={1}","001",19).set({
                    level:20
                }).commit(function(e,r){
                     console.log(e);
                        console.log(r);
                });

    5.3 Delete:
            Where then delete

            .. code-block::

                    //sync call
                try {
                    var result=qr.where("code=={0} and level=={1}","001",19).delete();
                    console.log(result);
                } catch (error) {
                    console.log(error);
                }
                //async call
                 qr.where("code=={0} and level=={1}","001",19).delete(function(e,r){
                    console.log(r);
                    console.error(e);
                 });

    5.4 Push:
           Where , push then commit

            .. code-block::

                //sync call
                try {
                    var result=qr.where("code=={0} and level=={1}","001",19).push({
                        users:{
                            username:"test",
                            createdOn:new Date()
                        }
                    }).commit();
                    console.log(result)
                } catch (error) {
                    console.error(error);
                }
                //async call
                var result=qr.where("code=={0} and level=={1}","001",19).push({
                        users:{
                            username:"test",
                            createdOn:new Date()
                        }
                    }).commit(function(e,r){
                         console.log(e);
                            console.log(r);
                    });
    5.5 Pull:
           Where , pull then commit

           .. code-block::

                //sync call
                try {
                    var result=qr.where("code=={0} and level=={1}","001",19)
                    .pull("users.username=={0}","test")
                    .commit();
                    console.log(result)
                } catch (error) {
                    console.error(error);
                }
                    //async call
                    var result=qr.where("code=={0} and level=={1}","001",19)
                    .pull("users.username=={0}","test")
                    .commit(function(e,r){
                         console.log(e);
                            console.log(r);
                    });
    5.6 Inc:
        where, inc then commit

        .. code-block::

                //sync call
                try {
                    var result=qr.where("code=={0} and level=={1}","001",19)
                    .inc({hitCount:1})
                    .commit();
                    console.log(result)
                } catch (error) {
                    console.error(error);
                }
                    //async call
                    var result=qr.where("code=={0} and level=={1}","001",19)
                    .inc({hitCount:1})
                    .commit(function(e,r){
                         console.log(e);
                            console.log(r);
                    });
6- aggregate:
   For aggregate we will show each example equivalent to each example at https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/

   6.1: project:
        See https://docs.mongodb.com/manual/reference/operator/aggregation/project/

        .. code-block::

            var data={
                "_id" : 1,
                title: "abc123",
                isbn: "0001122223334",
                author: { last: "zzz", first: "aaa" },
                copies: 5
            }
             var books=coll.coll("main","books");
             try {
                books.insert(data).commit();
                //db.books.aggregate( [ { $project : { title : 1 , author : 1 } } ] )
                var agg=books.aggregate()
                agg.project({
                    title:1,
                    author:1
                })
                var items=agg.items();
                console.log(items);
             } catch (error) {

             }

        .. code-block::

            var data=[{
                    "_id" : 1,
                    title: "abc123",
                    isbn: "0001122223334",
                    author: { last: "zzz", first: "aaa" },
                    copies: 5,
                    lastModified:new Date("2016-07-28")
                  },
                  {
                    "_id" : 2,
                    title: "Baked Goods",
                    isbn: "9999999999999",
                    author: { last: "xyz", first: "abc", middle: "" },
                    copies: 2,
                    lastModified:new Date("2017-07-21")
                  },
                  {
                    "_id" : 3,
                    title: "Ice Cream Cakes",
                    isbn: "8888888888888",
                    author: { last: "xyz", first: "abc", middle: "mmm" },
                    copies: 5,
                    lastModified:new Date("2017-07-22")
                  }]
                 var books=coll.coll("main","books1");
                 /***
                  * db.books.aggregate( [
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
                 try {
                    // var ret=books.insert(data).commit();
                    // console.log(ret);
                    //db.books.aggregate( [ { $project : { title : 1 , author : 1 } } ] )
                    var agg=books.aggregate();
                    agg.project({
                        title:1,
                        "author.first": 1,
                        "author.last" : 1,
                        "author.middle":"if($author.middle=={0},{1},author.middle)"
                    },"","$$REMOVE")
                    var items=agg.items();
                    console.log(items);
                 } catch (error) {
                    console.log(error);
                 }

        .. code-block::

            var data=[{
            "_id" : 1,
            title: "abc123",
            isbn: "0001122223334",
            author: { last: "zzz", first: "aaa" },
            copies: 5
          }]
         var books=coll.coll("main","books3");
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
         try {
             var ret=books.insert(data).commit();

            var agg=books.aggregate();
            agg.project({
                title:1,
                isbn:{
                    prefix:"substr(isbn,0,3)",
                    group:"substr(isbnm,3,2)",
                    publisher:"substr(isbn,9,3)",
                    checkDigit:"substr(isbn,12,1)"
                },
                lastName: "author.last",
                copiesSold: "copies"})
            var items=agg.items();
            console.log(JSON.stringify(items));
         } catch (error) {
            console.log(error);
         }
