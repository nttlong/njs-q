
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
        For this link https://docs.mongodb.com/manual/reference/operator/aggregation/project/
        . It could be rewritten by below:

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


    6.2: redact:
        For this link https://docs.mongodb.com/manual/reference/operator/aggregation/redact/
        . It could be rewritten by below:
        .. code-block::

            var data=[{
            _id: 1,
            title: "123 Department Report",
            tags: [ "G", "STLW" ],
            year: 2014,
            subsections: [
              {
                subtitle: "Section 1: Overview",
                tags: [ "SI", "G" ],
                content:  "Section 1: This is the content of section 1."
              },
              {
                subtitle: "Section 2: Analysis",
                tags: [ "STLW" ],
                content: "Section 2: This is the content of section 2."
              },
              {
                subtitle: "Section 3: Budgeting",
                tags: [ "TK" ],
                content: {
                  text: "Section 3: This is the content of section3.",
                  tags: [ "HCS" ]
                }
              }
            ]
          }]
             var forecasts=coll.coll("main","forecasts");
             /*
               db.forecasts.aggregate(
               [
                 { $match: { year: 2014 } },
                 { $redact: {
                    $cond: {
                       if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
                       then: "$$DESCEND",
                       else: "$$PRUNE"
                     }
                   }
                 }
               ]
            );
            )
          */
         try {
            var userAccess = [ "STLW", "G" ];
            var ret=forecasts.insert(data).commit();

            var agg=forecasts.aggregate();
            agg.match("year==2014")
            agg.redact("if(size(setIntersection(tags,{0}))>0,{1},{2})",userAccess,"$$DESCEND","$$PRUNE");
            console.log(JSON.stringify(agg.__pipe));
            var items=agg.items();
            console.log(JSON.stringify(items));
         } catch (error) {
            console.log(error);
         }

        .. code-block::

             var data=[{
            _id: 1,
            level: 1,
            acct_id: "xyz123",
            cc: {
              level: 5,
              type: "yy",
              num: 000000000000,
              exp_date: new Date("2015-11-01T00:00:00.000Z"),
              billing_addr: {
                level: 5,
                addr1: "123 ABC Street",
                city: "Some City"
              },
              shipping_addr: [
                {
                  level: 3,
                  addr1: "987 XYZ Ave",
                  city: "Some City"
                },
                {
                  level: 3,
                  addr1: "PO Box 0123",
                  city: "Some City"
                }
              ]
            },
            status: "A"
          }]
         var forecasts=coll.coll("main","forecasts1");
         /*
            db.accounts.aggregate(
            [
                { $match: { status: "A" } },
                {
                $redact: {
                    $cond: {
                    if: { $eq: [ "$level", 5 ] },
                    then: "$$PRUNE",
                    else: "$$DESCEND"
                    }
                }
                }
            ]
            );
          */
         try {

            var ret=forecasts.insert(data).commit();
            var agg=forecasts.aggregate();
            agg.match("status=={0}","A")
            agg.redact("if(level==5,{1},{0})","$$DESCEND","$$PRUNE");
            console.log(JSON.stringify(agg.__pipe));
            var items=agg.items();
            console.log(JSON.stringify(items));
         } catch (error) {
            console.log(error);
         }

    6.3 replaceRoot:
        https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/

        .. code-block::

            var data=[{
                "_id" : 1,
                "fruit" : [ "apples", "oranges" ],
                "in_stock" : { "oranges" : 20, "apples" : 60 },
                "on_order" : { "oranges" : 35, "apples" : 75 }
             },
             {
                "_id" : 2,
                "vegetables" : [ "beets", "yams" ],
                "in_stock" : { "beets" : 130, "yams" : 200 },
                "on_order" : { "beets" : 90, "yams" : 145 }
             }]
             var produce=coll.coll("main","produce");
             /*
                db.produce.aggregate( [
                {
                    $replaceRoot: { newRoot: "$in_stock" }
                }
                ] )
              */
             try {

                var ret=produce.insert(data).commit();
                var agg=produce.aggregate();
                agg.replaceRoot("in_stock")
                console.log(JSON.stringify(agg.__pipe));
                var items=agg.items();
                console.log(JSON.stringify(items));
             } catch (error) {
                console.log(error);
             }

        .. code-block::

             var data=[{ "_id" : 1, "name" : "Arlene", "age" : 34, "pets" : { "dogs" : 2, "cats" : 1 } },
                        { "_id" : 2, "name" : "Sam", "age" : 41, "pets" : { "cats" : 1, "hamsters" : 3 } },
                        { "_id" : 3, "name" : "Maria", "age" : 25 }];
             var people=coll.coll("main","people");
             /*
                        db.people.aggregate( [
                            {
                                $match: { pets : { $exists: true } }
                            },
                            {
                                $replaceRoot: { newRoot: "$pets" }
                            }
                        ] )
              */
             try {

                var ret=people.insert(data).commit();
                var agg=people.aggregate();
                agg.match("exists(pets)")
                agg.replaceRoot("pets")
                console.log(JSON.stringify(agg.__pipe));
                var items=agg.items();
                console.log(JSON.stringify(items));
             } catch (error) {
                console.log(error);
             }

        .. code-block::

                var data=[  { "_id" : 1, "first_name" : "Gary", "last_name" : "Sheffield", "city" : "New York" },
                            { "_id" : 2, "first_name" : "Nancy", "last_name" : "Walker", "city" : "Anaheim" },
                            { "_id" : 3, "first_name" : "Peter", "last_name" : "Sumner", "city" : "Toledo" }];
                 var contacts=coll.coll("main","contacts");
                 /*
                           db.contacts.aggregate( [
                            {
                                $replaceRoot: {
                                    newRoot: {
                                        full_name: {
                                        $concat : [ "$first_name", " ", "$last_name" ]
                                        }
                                    }
                                }
                            }
                            ] )
                  */
                 try {

                     var ret=contacts.insert(data).commit();
                    var agg=contacts.aggregate();

                    agg.replaceRoot({
                        full_name:"concat(first_name,{0},last_name)"
                    }," ");
                    console.log(JSON.stringify(agg.__pipe));
                    var items=agg.items();
                    console.log(JSON.stringify(items));
                 } catch (error) {
                    console.log(error);
                 }


        .. code-block::

            var data=[ { "_id" : 1, "name" : "Susan",
                "phones" : [ { "cell" : "555-653-6527" },
             { "home" : "555-965-2454" } ] },
                { "_id" : 2, "name" : "Mark",
                    "phones" : [ { "cell" : "555-445-8767" },
                            { "home" : "555-322-2774" } ] }];
                 var contacts=coll.coll("main","contacts1");
                 /*
                           db.contacts.aggregate( [
                    {
                        $unwind: "$phones"
                    },
                    {
                        $match: { "phones.cell" : { $exists: true } }
                    },
                    {
                        $replaceRoot: { newRoot: "$phones"}
                    }
                    ] )
                  */
                 try {

                    var ret=contacts.insert(data).commit();
                    var agg=contacts.aggregate();

                    agg.unwind("phones").match("exists(phones.cell)")
                    agg.replaceRoot("phones")
                    console.log(JSON.stringify(agg.__pipe));
                    var items=agg.items();
                    console.log(JSON.stringify(items));
                 } catch (error) {
                    console.log(error);
                }
7- Functions
    7.1 in:
        https://docs.mongodb.com/manual/reference/operator/query/in/

        .. code-block::

            var data=[ { _id: 1, item: "abc", qty: 10, tags: [ "school", "clothing" ], sale: false }];

             var inventory=coll.coll("main","inventory");
             /*
                db.inventory.update(
                                 { tags: { $in: ["appliances", "school"] } },
                                 { $set: { sale:true } }
                               )
              */
             try {

                var ret=inventory.insert(data).commit();
                inventory.where("in(tags,{0})",["appliances", "school"])
                          .set({sale:true})
                          .commit();
             } catch (error) {
                console.log(error);
             }


        .. code-block::

            var inventory=coll.coll("main","inventory");
             /*
                db.inventory.find( { tags: { $in: [ /^be/, /^st/ ] } } )
              */
             try {

                // var ret=inventory.insert(data).commit();
                var items=inventory.where("in(tags,{0})",[ /^be/, /^st/]).items();
                console.log(JSON.stringify(items))

             } catch (error) {
                console.log(error);
             }
8- Group:
    https://docs.mongodb.com/manual/reference/operator/aggregation/group/

    .. code-block::

        var data=[
             { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : new Date("2014-03-01T08:00:00Z") },
             { "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : new Date("2014-03-01T09:00:00Z") },
            { "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : new Date("2014-03-15T09:00:00Z") },
            { "_id" : 4, "item" : "xyz", "price" : 5, "quantity" : 20, "date" : new Date("2014-04-04T11:21:39.736Z") },
            { "_id" : 5, "item" : "abc", "price" : 10, "quantity" : 10, "date" : new Date("2014-04-04T21:23:13.331Z") }];

         var sales=coll.coll("main","sales");
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
         try {

            // var ret=sales.insert(data).commit();
            var qr=sales.aggregate().group({
                _id:{
                    month:"month(date)",
                    day:"dayOfMonth(date)",
                    year:"year(date)"
                },
                totalPrice:"sum(price*quantity)",
                averageQuantity:"avg(quantity)",
                count:"sum(1)"
            });
            console.log(JSON.stringify(qr.__pipe));
            var items=qr.items();
            console.log(JSON.stringify(items));

         } catch (error) {
            console.log(error);
         }

    .. code-block::

        var sales=coll.coll("main","sales");
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
        )
          */
         try {

            // var ret=sales.insert(data).commit();
            var qr=sales.aggregate().group({
                _id:null,
                totalPrice:"sum(price*quantity)",
                averageQuantity:"avg(quantity)",
                count:"sum(1)"
            });
            console.log(JSON.stringify(qr.__pipe));
            var items=qr.items();
            console.log(JSON.stringify(items));

         } catch (error) {
            console.log(error);
         }

    .. code-block::

        var sales=coll.coll("main","sales");
         /*
            db.sales.aggregate( [ { $group : { _id : "$item" } } ] )
          */
         try {

            // var ret=sales.insert(data).commit();
            var qr=sales.aggregate().group({
                _id:"item"
            });
            console.log(JSON.stringify(qr.__pipe));
            var items=qr.items();
            console.log(JSON.stringify(items));

         } catch (error) {
            console.log(error);
         }

