const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhhgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try{
        await client.connect();
        const database = client.db('comfy-sloth');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('order');

        // get all products 
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find({}).toArray();
            res.send(products);
        })

        //get order product
        app.get('/product/:id', async (req, res) => {
            const query = req.params.id;
            const result = await productsCollection.find({ _id: ObjectId(query) })
            .toArray();
            res.send(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)  => {
    res.send('Comfy sloth Server Run');
})
app.listen(port, () => {
    console.log('Comfy sloth server at port', port)
})