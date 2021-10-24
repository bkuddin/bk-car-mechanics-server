const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ieoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET API Start
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // GET API End

    // GET Single Service Start
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // GET Single Service End

    // POST API Start
    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log("hit the post API", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      // res.send("post hitted");
      res.json(result);
    });

    // POST API End

    // DELETE API Start
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // DELETE API End
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Default Route or API Link

app.get("/", (req, res) => {
  res.send("Running Bk Car Mechanics Server");
});

app.listen(port, () => {
  console.log("Running Bk Car Mechanics Server on Port", port);
});
