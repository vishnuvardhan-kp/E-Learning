const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = "mongodb+srv://kamalvishnu54_db_user:Vishnu2007@cluster0.w2oqz4l.mongodb.net/?appName=Cluster0";

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
