const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://shreenidhiu24cse_db_user:mq6GibGqnP4iy2wj@ac-urxpyhw-shard-00-00.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-01.melg0zk.mongodb.net:27017,ac-urxpyhw-shard-00-02.melg0zk.mongodb.net:27017/?ssl=true&replicaSet=atlas-mytrdx-shard-0&authSource=admin&appName=Cluster0";

async function seedData() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("elearning");

        // 1. Add Realistic Courses
        const courses = [
            { 
                title: "Object Oriented Programming", 
                code: "CS301", 
                desc: "Learn Java, Classes, and Inheritance.", 
                instructorId: "69f5b87ce9615414a82ace23", 
                instructorName: "testinstructor",
                dept: "CSE",
                status: "Active",
                enrollmentCount: 0
            },
            { 
                title: "Database Management Systems", 
                code: "CS302", 
                desc: "Master SQL and NoSQL databases.", 
                instructorId: "69f5b87ce9615414a82ace23", 
                instructorName: "testinstructor",
                dept: "CSE",
                status: "Active",
                enrollmentCount: 0
            }
        ];

        const courseResult = await db.collection("courses").insertMany(courses);
        const oopCourseId = courseResult.insertedIds[0].toString();
        const dbmsCourseId = courseResult.insertedIds[1].toString();

        // 2. Add Assignments
        const assignments = [
            {
                title: "Java Inheritance Lab",
                courseId: oopCourseId,
                deadline: "2026-05-15",
                totalMarks: 100,
                submissionsCount: 0
            },
            {
                title: "SQL Query Optimization",
                courseId: dbmsCourseId,
                deadline: "2026-05-20",
                totalMarks: 50,
                submissionsCount: 0
            }
        ];
        await db.collection("assignments").insertMany(assignments);

        // 3. Add Course Content
        const content = [
            {
                title: "Module 1: Introduction to OOP",
                courseId: oopCourseId,
                items: "3 Files (PDF, Video)",
                type: "Lecture"
            },
            {
                title: "SQL Cheat Sheet",
                courseId: dbmsCourseId,
                items: "1 File (PDF)",
                type: "Reference"
            }
        ];
        await db.collection("content").insertMany(content);

        // 4. Add a Global Notification
        await db.collection("notifications").insertOne({
            title: "Semester Exams Schedule",
            message: "The final exams will begin from June 1st. Check the notice board for details.",
            sender: "Admin",
            createdAt: new Date()
        });

        console.log("Realistic sample data seeded successfully!");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

seedData();
