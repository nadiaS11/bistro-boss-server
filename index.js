const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const jwt = require('jsonwebtoken')
port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://practice:practice@cluster0.ly9jdk7.mongodb.net/practiceDB?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("practiceDB").collection("menu");
    const reviewCollection = client.db("practiceDB").collection("reviews");
    const curtCollection = client.db("practiceDB").collection("curt");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await curtCollection.find(query).toArray();
      res.send(result);
    });
    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const cartItem = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: cartItem.name,
          recipe: cartItem.recipe,
          image: cartItem.image,
          category: cartItem.category,
          price: cartItem.price,
          email: cartItem.email,
        },
        $inc: { quantity: 1 },
      };
      const result = await curtCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro Boss here!");
});

app.listen(port, () => {
  console.log(`Bistro boss listening on port ${port}`);
});
