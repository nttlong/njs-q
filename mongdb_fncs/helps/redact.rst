13.1 Evaluate Access at Every Document Level
    https://docs.mongodb.com/manual/reference/operator/aggregation/redact/#evaluate-access-at-every-document-level
        .. code-block::

            db.loadServerScripts()
            db.forecasts.remove({})
            db.forecasts.insert([
               {
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
            }
            ])

            /*

                       var userAccess = [ "STLW", "G" ];
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

            */
            query("forecasts").match("year==2014")
            .redact("iif(size(setIntersection(tags,{0}))>0,{1},{2})",[ "STLW", "G" ],"$$DESCEND","$$PRUNE")

            .items()

13.2 Exclude All Fields at a Given Level:
        https://docs.mongodb.com/manual/reference/operator/aggregation/redact/#evaluate-access-at-every-document-level
            .. code-block::

                db.loadServerScripts()
                db.accounts.remove({})
                db.accounts.insert([
                   {
                  _id: 1,
                  level: 1,
                  acct_id: "xyz123",
                  cc: {
                    level: 5,
                    type: "yy",
                    num: 0,
                    exp_date: ISODate("2015-11-01T00:00:00.000Z"),
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
                }
                ])

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
                query("accounts").match("status=='A'")
                .redact("iif(level==5,{0},{1})","$$PRUNE","$$DESCEND")

                .items()
