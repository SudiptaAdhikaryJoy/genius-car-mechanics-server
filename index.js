const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9cyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET SINGLE API
        app.get(':serviceId', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req,res)=>{
            const service = req.body;
            console.log('services hit the post', req.body);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('running genius server 5000');
});

app.get('/hello', (req, res)=>{
    res.send('ami sudipta');
})

app.listen(port, ()=>{
    console.log('running genius server on port 5000', port);
})