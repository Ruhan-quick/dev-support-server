const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiqme.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World! working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("devSupport").collection("services");
  const teacherCollection = client.db("devSupport").collection("teachers");
  const adminCollection = client.db("devSupport").collection("admins");
  const requestCollection = client.db("devSupport").collection("requests");
  console.log("db connected successfully");
  //add service
  app.post("/addService", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showServices", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log("document sent");
    });
  });
  //add teachers

  app.post("/addTeacher", (req, res) => {
    const teacher = req.body;
    teacherCollection.insertOne(teacher).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showTeacher", (req, res) => {
    teacherCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log("document sent");
    });
  });

  //add admin
  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //send request
  app.post("/sendRequest", (req, res) => {
    const request = req.body;
    requestCollection.insertOne(request).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
