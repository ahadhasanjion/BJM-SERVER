const express = require ('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k5l2a3d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('bjm').collection('services');
        const orderCollection = client.db('bjm').collection('orders');
        const reviewCollection = client.db('bjm').collection('reviews');

        app.get('/servic', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service =  await serviceCollection.findOne(query)
            console.log(service);
            res.send(service);
            
        })

        // app.get('/reviews', async(req, res)=> {
        //     let query = {};
        //     console.log(req.query)
        //     if(req.query.serviceId){
        //         query = {
        //              name :req.query.serviceId
        //         }
        //     }
        //     const cursor =  reviewCollection.find(query)
        //     const result =  await cursor.toArray()
        //     res.send(result)
        // })

        app.post('/reviews', async(req, res)=> {
            const review = req.body;
            const result= await reviewCollection.insertOne(review);
            res.send(result);
        });

    


        app.get('/review', async(req, res)=>{
            let query = {}
            if(req.query.service_id){
                query={
                    service_id : req.query.service_id
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        

        //service client revies
        app.get('/reviews', async(req, res)=>{
    
            let query = {};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })


        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result);

        })
        // app.get('/service', async(req, res)=>{
    
        //     let query = {};
        //     if(req.query.email){
        //         query={
        //             email: req.query.email
        //         }
        //     }

        //     const cursor = reviewCollection.find(query);
        //     const reviews = await cursor.toArray();
        //     res.send(reviews)
        // })

    }
    finally{}
}
run().catch(error => console.error(error))





app.get('/', (req, res) => {
    res.send('bjm server')
})

app.listen(port, () => {
    console.log('bjm server running')
})






