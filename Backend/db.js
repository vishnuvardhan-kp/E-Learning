const crypto = require('crypto');
if (!global.crypto) {
    global.crypto = crypto;
}
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://shreenidhiu24cse_db_user:mq6GibGqnP4iy2wj@ac-urxpyhw-shard-00-00.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-01.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-02.melg0zk.mongodb.net:27017/?ssl=true&replicaSet=atlas-mytrdx-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("elearning"); // Name of your database
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

function getDB() {
  return db;
}



module.exports = { connectDB, getDB };