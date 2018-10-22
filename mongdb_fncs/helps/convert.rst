convert(<fieldname or any value>,<convert to type>,[onNull:any],[onError:any])
    https://docs.mongodb.com/manual/reference/operator/aggregation/convert/#example
        .. code-block::

            db.loadServerScripts()

            db.orders.drop()
            db.orders.insertMany([
                       { _id: 1, item: "apple", qty: 5, price: 10 },
                       { _id: 2, item: "pie", qty: 10, price: NumberDecimal("20.0") },
                       { _id: 3, item: "ice cream", qty: 2, price: "4.99" },
                       { _id: 4, item: "almonds" },
                       { _id: 5, item: "bananas", qty: 5000000000, price: NumberDecimal("1.25") }
                ])
            /*
               // Define stage to add convertedPrice and convertedQty fields with the converted price and qty values
                // If price or qty values are missing, the conversion returns a value of decimal value or int value of 0.
                // If price or qty values cannot be converted, the conversion returns a string

                priceQtyConversionStage = {
                   $addFields: {
                      convertedPrice: { $convert: { input: "$price", to: "decimal", onError: "Error", onNull: NumberDecimal("0") } },
                      convertedQty: { $convert: {
                         input: "$qty", to: "int",
                         onError:{$concat:["Could not convert ", {$toString:"$qty"}, " to type integer."]},
                         onNull: NumberInt("0")
                      } },
                   }
                };

                totalPriceCalculationStage = {
                   $project: { totalPrice: {
                     $switch: {
                        branches: [
                          { case: { $eq: [ { $type: "$convertedPrice" }, "string" ] }, then: "NaN" },
                          { case: { $eq: [ { $type: "$convertedQty" }, "string" ] }, then: "NaN" },
                        ],
                        default: { $multiply: [ "$convertedPrice", "$convertedQty" ] }
                     }
                } } };

                db.orders.aggregate( [
                   priceQtyConversionStage,
                   totalPriceCalculationStage
                ])
            */
            query("orders")
            .addFields({
                convertedPrice:"convert(price,'decimal',0,'Error')",
                convertedQty:"convert(qty,'int',0,concat('Could not convert ',toString(qty),' to type integer.'))"
            })
            .project({
                totalPrice:"switch(case(type(convertedPrice)=='string','NaN'),case(type(convertedQty)=='string','NaN'),convertedPrice*convertedQty)"
            })
            .items()