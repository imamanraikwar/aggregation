const path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


// const agg = [
//   {$match : {"address.state":"CA"}},
//   {$sort:{total:-1}},
//   {$limit:5}
// ]

const agg = [
  {
    $group: {
      _id: '$customer.fullName',
      totalOrders:{
        $count:{}
      },
      totalItemsPurchased:{
        $sum:{
          $size:'$items'
        }
      }
    },
    
  },
  {
    $limit:20
  }
]

async function run() {
  try {
    const database = client.db("aggregation");
    //const result = await database.collection("customers").aggregate(agg).toArray();
    const result = await database.collection("orders").aggregate(agg).toArray();

    console.log(JSON.stringify(result));
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

run();
