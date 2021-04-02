const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfr7q.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const booksCollection = client.db("bookHouse").collection("books");
  const ordersCollection = client.db("bookHouse").collection("orders");
  
  app.get('/books', (req, res)=>{
    booksCollection.find()
    .toArray((err, items)=>{
      res.send(items)
    })
  })

  app.get('/order/:id', (req, res)=>{
    booksCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/addBook', (req, res)=>{
    const newBook = req.body;
    booksCollection.insertOne(newBook)
    .then(result=>{
      console.log('count', result.insertedCount)
      res.send(result.insertedCount >0 )
    })
  })

  app.delete("/delete/:id", (req, res)=>{
    booksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result)
    });
    // console.log(req.params.id)
  });

  app.post('/addOrder', (req, res)=>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result=>{
      res.send(result.insertedCount >0 )
    })
  })

  app.get('/orders', (req, res)=>{
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})