const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

// APP
const app = express();

app.use(
  bodyParser.urlencoded({
    limit: "3mb",
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "3mb" }));

app.use(express.static(__dirname.replace("src", "") + "build"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname.replace("src", ""), "build/index.html"));
});

// use when starting application locally
const mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// // use when starting application as docker container
// let mongoUrlDocker = "mongodb://admin:password@mongodb";

// // pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// // "user-account" in demo with docker. "my-db" in demo with docker-compose
// // let databaseName = "my-db";
const databaseName = "user-data";
let collectionName = "";

app.post("/user-signup", (req, res) => {
  const userObj = req.body;
  collectionName = userObj.uniqueID;
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      const db = client.db(databaseName);
      const query = { uniqueID: userObj.uniqueID };

      db.collection(collectionName).findOne(query, (err, result) => {
        if (err) throw err;

        if (!result) {
          db.collection(collectionName).insertOne(userObj, (err, result) => {
            if (err) throw err;
            client.close();
          });
        }
      });
    }
  );
  // Send response
  res.send(userObj);
});

app.get("/get-logindata/:email", (req, res) => {

  const email = req.params.email;
  collectionName = email && email.split('@')[0];
  // Connect to the db
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);

      db.collection(collectionName)
        .findOne({}, function (err, result) {
          if (err) throw err;
          else if (result) {
            res.send(result);
          }
          client.close();
        });
    }
  );
});

app.post("/add-user", (req, res) => {
  const userObj = req.body;
  userObj.id = uuidv4();
  userObj.date = new Date().toLocaleDateString("en-GB");
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      const db = client.db(databaseName);
      db.collection(collectionName).insertOne(userObj, (err, res) => {
        if (err) throw err;
        client.close();
      });
    }
  );
  // Send response
  res.send(userObj);
});

app.get("/get-allUsers/:currentDate", (req, res) => {
  // Connect to the db
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);
      const query = {dob: req.params.currentDate}

      db.collection(collectionName)
        .find(query)
        .sort({ dob: 1 })
        .toArray(function (err, result) {
          if (err) throw err;
          else if (result) {
            res.send(result);
          }
          client.close();
        });
    }
  );
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
