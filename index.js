const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const jwt = require('jsonwebtoken')
port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ly9jdk7.mongodb.net/practiceDB?retryWrites=true&w=majority`;
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
    const userCollection = client.db("practiceDB").collection("users");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      };
      console.log(updateDoc);
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
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

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await curtCollection.deleteOne(query);
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
