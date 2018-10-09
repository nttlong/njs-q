
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
        * -
          -
          -
          -






