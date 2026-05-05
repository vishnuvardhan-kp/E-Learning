const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = "mongodb+srv://kamalvishnu54_db_user:Vishnu2007@cluster0.w2oqz4l.mongodb.net/?appName=Cluster0";

async function createTestUsers() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("elearning");
        
        // 1. Create Admin
        const adminPassword = await bcrypt.hash("admin123", 10);
        await db.collection("admins").updateOne(
            { username: "admin" },
            { $set: { 
                username: "admin", 
                email: "admin@elearning.com", 
                password: adminPassword 
            } },
            { upsert: true }
        );
        console.log("✅ Admin created: admin / admin123");

        // 2. Create Student
        const studentPassword = await bcrypt.hash("student123", 10);
        await db.collection("students").updateOne(
            { username: "teststudent" },
            { $set: { 
                username: "teststudent", 
                email: "student@elearning.com", 
                password: studentPassword,
                dept: "CSE",
                year: "3rd",
                section: "A",
                rollno: "CS101"
            } },
            { upsert: true }
        );
        console.log("✅ Student created: teststudent / student123");

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

createTestUsers();
