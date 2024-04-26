const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xtia1kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const craftItemsCollection = client.db('canvasCrazeDB').collection('craftItems');

        app.get('/craftItems', async(req, res) => {
            const result = await craftItemsCollection.find().toArray();
            res.send(result);
        })

        app.post('/craftItems', async(req, res) => {
            const item = req.body;
            const result = await craftItemsCollection.insertOne(item);
            res.send(result);
            console.log(item);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Canvas Craze server is running');
});

app.listen(port, () => {
    console.log(`Canvas Craze server listening on port ${port}`)
})