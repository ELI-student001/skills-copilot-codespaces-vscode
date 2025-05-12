// Create web server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db('commentsDB');
        const commentsCollection = database.collection('comments');

        // Create a comment
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.status(201).json(result);
        });

        // Get all comments
        app.get('/comments', async (req, res) => {
            const comments = await commentsCollection.find({}).toArray();
            res.status(200).json(comments);
        });

        // Delete a comment
        app.delete('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
            res.status(204).json(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
    }
}

