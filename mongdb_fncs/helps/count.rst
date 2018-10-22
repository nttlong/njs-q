https://docs.mongodb.com/manual/reference/operator/aggregation/count/#example
    .. code-block::

           db.scores.remove({});
            db.scores.insertMany([
                { "_id" : 1, "subject" : "History", "score" : 88 },
                { "_id" : 2, "subject" : "History", "score" : 92 },
                { "_id" : 3, "subject" : "History", "score" : 97 },
                { "_id" : 4, "subject" : "History", "score" : 71 },
                { "_id" : 5, "subject" : "History", "score" : 79 },
                { "_id" : 6, "subject" : "History", "score" : 83 }

                ])

            /*
              db.scores.aggregate(
              [
                {
                  $match: {
                    score: {
                      $gt: 80
                    }
                  }
                },
                {
                  $count: "passing_scores"
                }
              ]
            )
            */
             //console.log({x:"$push($title)"} instanceof Object)
            query("scores").match("score>80").count("passing_scores")
            .item()
