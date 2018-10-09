
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
            ]) ;
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
        ],function(e,r){
            console.log(r);
            console.log(e);
        }) ;


    5.2 Update:

        .. list-table:: where, update then commit
            :widths: 25 25 10 40
            :header-rows: 1

            * -  Params
              -  Type
              -  Require
              -  Description
            * - Data insert
              -  jon object
              -  yes
              -  The data will be insert when commit was called
