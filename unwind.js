const path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

//number of orders per vendor with vendor information
const agg = [
    {
      '$unwind': {
        'path': '$items', 
        'includeArrayIndex': 'index'
      }
    }, {
      '$group': {
        '_id': '$items.vendor', 
        'purchase': {
          '$count': {}
        }
      }
    }, {
      '$sort': {
        'purchases': -1
      }
    }, {
      '$lookup': {
        'from': 'vendors', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'vendor'
      }
    }, {
      '$unset': 'result.items'
    }
  ]

async function run() {
  try {
    const database = client.db("aggregation");
    const result = await database.collection("orders").aggregate(agg).toArray();

    console.log(result);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

run();
