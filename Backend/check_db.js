const { MongoClient } = require("mongodb");

const uri = "mongodb://shreenidhiu24cse_db_user:mq6GibGqnP4iy2wj@ac-urxpyhw-shard-00-00.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-01.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-02.melg0zk.mongodb.net:27017/?ssl=true&replicaSet=atlas-mytrdx-shard-0&authSource=admin&appName=Cluster0";

async function checkDB() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("elearning");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`Collection ${coll.name}: ${count} documents`);
      const sample = await db.collection(coll.name).findOne();
      console.log(`Sample from ${coll.name}:`, JSON.stringify(sample, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkDB();
