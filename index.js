const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("bson");
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
  const reviewCollection = client.db("devSupport").collection("reviews");
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
    });
  });

  //add admin
  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/showAdmins", (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //send request
  app.post("/sendRequest", (req, res) => {
    const request = req.body;
    requestCollection.insertOne(request).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/showRequests", (req, res) => {
    requestCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.get("/showAllRequest", (req, res) => {
    requestCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //specific request single
  app.get("/request/:id", (req, res) => {
    requestCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        res.send(documents[0]);
      });
  });
  //update
  app.patch("/update/:id", (req, res) => {
    console.log(req.params.id, req.body.status);
    requestCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });

  //send review
  app.post("/sendReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/showReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || port);
