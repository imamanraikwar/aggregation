const path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


const agg = [
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          discount: {
            $cond: [
              {
                $lte: ["$price", 500]
              },
              0.4,
              0.65
            ]
          }
        }
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          salePrice: {
            $multiply: [
              "$price",
              {
                $subtract: [1, "$discount"]
              }
            ]
          }
        }
    },
    {
      $unset:
        /**
         * Provide the field name to exclude.
         * To exclude multiple fields, pass the field names in an array.
         */
        "quantity"
    },
    {$limit: 10}
  ]

async function run() {
  try {
    const database = client.db("aggregation");
    //const result = await database.collection("customers").aggregate(agg).toArray();
    const result = await database.collection("orders").aggregate(agg).toArray();

    console.log(result);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

run();
