const path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

//number of orders per vendor with vendor information
const agg = [
    {$limit:10},
    {
        $addFields:{
            shipping:{
                $function : {
                    body:`
                    function(zipCode){
                    let firstDigit = parseInt(zipCode[0])
                    switch(firstDigit){
                    case 1:
                    case 2:
                    case 3:
                        return "1 day"

                    case 4:
                    case 5:
                    case 6:
                        return "2 day"

                    default:
                        return "3 day"
                    }
                    }
                    `,
                    args:["$address.zipCode"],
                    lang:'js'
                }
            }
        }
    }
]

async function run() {
  try {
    const database = client.db("aggregation");
    const result = await database.collection("customers").aggregate(agg).toArray();

    console.log(result);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

run();
