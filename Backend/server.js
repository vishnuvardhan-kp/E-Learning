const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// -- AUTH & USERS --
app.post('/auth/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    
    const db = getDB();
    const collectionName = role + 's';
    
    const user = await db.collection(collectionName).findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (user) {
        let isMatch = false;
        if (user.password && !user.password.startsWith('$2b$')) {
            isMatch = (user.password === password);
            if(isMatch) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.collection(collectionName).updateOne(
                    { _id: user._id },
                    { $set: { password: hashedPassword } }
                );
            }
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (isMatch) {
            res.json({ user: { _id: user._id, username: user.username, email: user.email, role } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/admin/create-user', async (req, res) => {
  try {
    const { role, password, ...otherData } = req.body;
    if (!['student', 'instructor'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection(role + 's').insertOne({ 
      ...otherData, 
      password: hashedPassword 
    });
    res.json({ message: "User created", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const { password, ...updateData } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    
    const db = getDB();
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await db.collection(role + 's').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/student', async (req, res) => {
  const db = getDB();
  const students = await db.collection("students").find({}).project({ password: 0 }).toArray();
  res.json(students);
});

app.get('/instructor', async (req, res) => {
  const db = getDB();
  const instructors = await db.collection("instructors").find({}).project({ password: 0 }).toArray();
  res.json(instructors);
});

app.get('/users/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const db = getDB();
    const user = await db.collection(role + 's').findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const db = getDB();
    const result = await db.collection(role + 's').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- COURSES --
app.post('/courses', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('courses').insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const db = getDB();
    const courses = await db.collection('courses').find({}).toArray();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// -- ASSIGNMENTS --
app.post('/assignments', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('assignments').insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/assignments', async (req, res) => {
  try {
    const db = getDB();
    const assignments = await db.collection('assignments').find({}).toArray();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const result = await db.collection('assignments').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- SUBMISSIONS --
app.post('/submissions', async (req, res) => {
  try {
    const db = getDB();
    const submission = {
      ...req.body,
      createdAt: new Date(),
      evaluated: false,
      grade: '',
      feedback: ''
    };
    const result = await db.collection('submissions').insertOne(submission);
    
    await db.collection('assignments').updateOne(
      { _id: new ObjectId(req.body.assignmentId) },
      { $inc: { submissionsCount: 1 } }
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/submissions/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const db = getDB();
    const submissions = await db.collection('submissions').find({ assignmentId }).toArray();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    const db = getDB();
    const result = await db.collection('submissions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { grade, feedback, evaluated: true } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- CONTENT --
app.post('/content', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('content').insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/content', async (req, res) => {
  try {
    const db = getDB();
    const content = await db.collection('content').find({}).toArray();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    const db = getDB();
    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(id) },
      { $set: { items } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NOTES --
app.post('/notes', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('notes').insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const db = getDB();
    const notes = await db.collection('notes').find({}).toArray();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/notes/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { upvotes: 1 } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NOTIFICATIONS --
app.post('/notifications', async (req, res) => {
  try {
    const db = getDB();
    const notification = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await db.collection('notifications').insertOne(notification);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notifications', async (req, res) => {
  try {
    const db = getDB();
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).toArray();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- ENROLLMENTS --
app.post('/enroll', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    console.log(`Enrollment Request: Student=${studentId}, Course=${courseId}`);
    const db = getDB();
    const existing = await db.collection('enrollments').findOne({ studentId, courseId });
    if (existing) {
      console.log("Already enrolled.");
      return res.status(400).json({ error: 'Already enrolled' });
    }
    const result = await db.collection('enrollments').insertOne({ 
      studentId, 
      courseId, 
      status: 'Active', 
      enrolledAt: new Date() 
    });
    console.log("Enrollment successful.");
    res.json(result);
  } catch (error) { 
    console.error("Enrollment error:", error);
    res.status(500).json({ error: error.message }); 
  }
});

app.get('/enroll/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const db = getDB();
    const enrollments = await db.collection('enrollments').find({ studentId }).toArray();
    res.json(enrollments);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/admin/enrollments', async (req, res) => {
  try {
    const db = getDB();
    const enrollments = await db.collection('enrollments').find({}).toArray();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
