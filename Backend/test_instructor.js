const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = "mongodb://shreenidhiu24cse_db_user:mq6GibGqnP4iy2wj@ac-urxpyhw-shard-00-00.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-01.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-02.melg0zk.mongodb.net:27017/?ssl=true&replicaSet=atlas-mytrdx-shard-0&authSource=admin&appName=Cluster0";

async function createTestInstructor() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("elearning");
        const hashedPassword = await bcrypt.hash("instructor123", 10);
        await db.collection("instructors").insertOne({
            username: "testinstructor",
            email: "test@instructor.com",
            password: hashedPassword,
            dept: "CSE",
            roleName: "Senior"
        });
        console.log("Test instructor created: testinstructor / instructor123");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

createTestInstructor();
