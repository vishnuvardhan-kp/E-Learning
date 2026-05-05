const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://kamalvishnu54_db_user:Vishnu2007@cluster0.w2oqz4l.mongodb.net/?appName=Cluster0";

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
