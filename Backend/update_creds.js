const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = "mongodb+srv://kamalvishnu54_db_user:Vishnu2007@cluster0.w2oqz4l.mongodb.net/?appName=Cluster0";

async function updateUsers() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("elearning");
        const hashedPassword = await bcrypt.hash("password", 10);
        
        // 1. Admin
        await db.collection("admins").updateOne(
            { username: "admin" },
            { $set: { email: "admin@gmail.com", password: hashedPassword } },
            { upsert: true }
        );

        // 2. Instructor
        await db.collection("instructors").updateOne(
            { username: "testinstructor" },
            { $set: { email: "instructo@gmail.com", password: hashedPassword } },
            { upsert: true }
        );

        // 3. Student
        await db.collection("students").updateOne(
            { username: "teststudent" },
            { $set: { email: "student@gmail.com", password: hashedPassword } },
            { upsert: true }
        );

        console.log("✅ Credentials updated to Gmail addresses with password 'password'");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

updateUsers();
