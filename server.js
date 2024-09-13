require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;
MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected successfully to MongoDB');
        db = client.db(dbName);
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });

app.get('/getStudentsDetails', async (req, res) => {
    try {
        const students = await db.collection('students').find({}).toArray();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch student details' });
    }
});

app.post('/addStudents', async (req, res) => {
    const inputData = req.body;

    try {
        if (Array.isArray(inputData)) {
            await db.collection('students').insertMany(inputData);
            res.status(201).json({ message: 'Students added successfully' });
        } else {
            await db.collection('students').insertOne(inputData);
            res.status(201).json({ message: 'Student added successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add students' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
