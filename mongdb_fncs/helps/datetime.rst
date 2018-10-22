5.1 - dateFromParts:

       dateFromParts(year:int,month:int,days:int,hours:int,minutes:int,seconds:int,milliseconds:int,timezone:string)
        Example:
            .. code-block::

                db.loadServerScripts()
                db.test.remove({})
                db.test.insertMany([
                    {_id:1,name:"A", publishOn:{"day":12,"month":11,"year":87} },
                    {_id:2,name:"B", publishOn:{"day":12,"month":3,"year":1997} },
                    {_id:3,name:"C",publishOn:{"day":25,"month":8,"year":1990} },
                    {_id:4,name:"D",publishOn:{"day":4,"month":4,"year":1} },
                    {_id:5,name:"E",publishOn:{"day":11,"month":11,"year":81} }
                    ])



                query("test").addFields({

                    myDate:"dateFromParts(switch(case( publishOn.year<10,2000+ publishOn.year),case(publishOn.year<1900,publishOn.year+1900), publishOn.year),publishOn.month,publishOn.day)"

                }).items()

5.2 - dateToParts:
        dateToParts(<fieldname or datetime value>,[timezone:text],[iso8601:boolean])
        .. code-block::

            db.loadServerScripts()
            db.test.drop()
            db.test.insertMany([
                {_id:1,name:"A", publishOn:{"day":12,"month":11,"year":87} },
                {_id:2,name:"B", publishOn:{"day":12,"month":3,"year":1997} },
                {_id:3,name:"C",publishOn:{"day":25,"month":8,"year":1990} },
                {_id:4,name:"D",publishOn:{"day":4,"month":4,"year":1} },
                {_id:5,name:"E",publishOn:{"day":11,"month":11,"year":81} }
                ])



            query("test").addFields({

                myDate:"dateFromParts(switch(case( publishOn.year<10,2000+ publishOn.year),case(publishOn.year<1900,publishOn.year+1900), publishOn.year),publishOn.month,publishOn.day)"

            })
            .addFields({
                publishDate:"dateToParts(myDate,null,true)"
            })
            .items()

5.3 - dateFromString:
            dateFromString(<fieldname or datetime value>,[format:string],[onNull:any],[onError:any])
            https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString/#examples
            .. code-block::

                db.loadServerScripts()
                db.logmessages.drop()
                db.logmessages.insertMany([
                   { _id: 1, date: "2017-02-08T12:10:40.787", timezone: "America/New_York", message:  "Step 1: Started" },
                    { _id: 2, date: "2017-02-08", timezone: "-05:00", message:  "Step 1: Ended" },
                    { _id: 3, message:  " Step 1: Ended " },
                    { _id: 4, date: "2017-02-09", timezone: "Europe/London", message: "Step 2: Started"},
                    { _id: 5, date: "2017-02-09T03:35:02.055", timezone: "+0530", message: "Step 2: In Progress"}
                    ])
                /*
                    db.logmessages.aggregate( [ {
                       $project: {
                          date: {
                             $dateFromString: {
                                dateString: '$date',
                                timezone: 'America/New_York'
                             }
                          }
                       }
                    } ] )
                */


                query("logmessages").project({

                    date:"dateFromString(date,null,'America/New_York')"

                }).items()

            https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString/#onerror
                .. code-block::

                    db.loadServerScripts()
                    db.dates.drop()
                    db.dates.insertMany([
                        { "_id" : 1, "date" : "2017-02-08T12:10:40.787", timezone: "America/New_York" },
                        { "_id" : 2, "date" : "20177-02-09T03:35:02.055", timezone: "America/New_York" }
                        ])
                    /*
                        db.dates.aggregate( [ {
                           $project: {
                              date: {
                                 $dateFromString: {
                                    dateString: '$date',
                                    timezone: '$timezone',
                                    onError: '$date'
                                 }
                              }
                           }
                        } ] )
                    */


                    query("dates").project({

                        date:"dateFromString(date,null,timezone,null,date)"

                    }).items()

            https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString/#onnull
                .. code-block::

                    db.loadServerScripts()
                    db.dates.drop()
                    db.dates.insertMany([
                        { "_id" : 1, "date" : "2017-02-08T12:10:40.787", timezone: "America/New_York" },
                        { "_id" : 2, "date" : null, timezone: "America/New_York" }
                        ])
                    /*
                        db.dates.aggregate( [ {
                           $project: {
                              date: {
                                 $dateFromString: {
                                    dateString: '$date',
                                    timezone: '$timezone',
                                    onNull: new Date(0)
                                 }
                              }
                           }
                        } ] )
                    */


                    query("dates").project({

                        date:"dateFromString(date,null,timezone,null,{0})"

                    }, new Date())
                    .items()

5.4 - dateToString:
    dateToString(<fieldname or datetime value>,<format:text>,[timezone:text],[onNull:any])

    https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/#example
        .. code-block::

            db.sales.insertMany([
                       {
                      "_id" : 1,
                      "item" : "abc",
                      "price" : 10,
                      "quantity" : 2,
                      "date" : ISODate("2014-01-01T08:15:39.736Z")
                    }
                ])
            /*
                db.sales.aggregate(
                   [
                     {
                       $project: {
                          yearMonthDayUTC: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                          timewithOffsetNY: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$date", timezone: "America/New_York"} },
                          timewithOffset430: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$date", timezone: "+04:30" } },
                          minutesOffsetNY: { $dateToString: { format: "%Z", date: "$date", timezone: "America/New_York" } },
                          minutesOffset430: { $dateToString: { format: "%Z", date: "$date", timezone: "+04:30" } }
                       }
                     }
                   ]
                )
            */


            query("sales").project({

                yearMonthDayUTC:"dateToString(date,'%Y-%m-%d')",
                timewithOffsetNY:"dateToString(date,'%H:%M:%S:%L%z','America/New_York')",
                timewithOffset430:"dateToString(date,'%H:%M:%S:%L%z','+04:30')",
                minutesOffsetNY:"dateToString(date,'%Z','America/New_York')",
                minutesOffset430:"dateToString(date,'%Z','+04:30')"

            }, new Date())
            .items()

5.5 dayOfMonth, dayOfWeek, dayOfYear, month,year, hour, minute and second:
     <function name>(<fieldname or datetime value>,[timezone:text])


