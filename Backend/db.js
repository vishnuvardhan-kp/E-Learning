const crypto = require('crypto');
if (!global.crypto) {
    global.crypto = crypto;
}

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI not found");
}

const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("elearning");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };