const express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
app.use(cors()) //Solve cors problem
app.use(bodyParser.json()) // parse application/json

const user = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${password}@cluster0-9t1sw.mongodb.net/test?retryWrites=true&w=majority`;

let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ['Asad', 'Moin', 'Saber', 'Susmita', 'Sohana', 'Sabana'];

//Get
app.get('/', (req, res) => {
    const fruit = {
        product: 'ada',
        price: 220
    }
    res.send(fruit);
});

app.get('/fruits/banana', (req, res) => {
    res.send({fruit: "banana", quantity: 1000, price: 10000})
});

app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().limit(10).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({message:err})
            } else {
                res.send(documents);
            }
        })
        client.close();
      });
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.query);
    const name = users[id]; 
    console.log(name);
    res.send({id, name})
})

//Post
app.post('/addProduct',(req, res) => {
    const product = req.body;
    console.log(product)
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({message:err})
            } else {
                res.send(result.ops[0]);
            }
        })
        client.close();
      });
})


const port = process.env.PORT || 4200
app.listen(port, () => console.log("Listening to port", port));