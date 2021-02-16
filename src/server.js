const express = require("express");
const path = require("path");
// const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

app.use(
  bodyParser.urlencoded({
    limit: "3mb",
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "5mb" }));

app.use(express.static(__dirname.replace("src", "") + "build"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname.replace("src", ""), "build/index.html"));
});

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// // use when starting application as docker container
// let mongoUrlDocker = "mongodb://admin:password@mongodb";

// // pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// // "user-account" in demo with docker. "my-db" in demo with docker-compose
// // let databaseName = "my-db";
let databaseName = "user-data";

app.post("/add-user", function (req, res) {
  let userObj = req.body;
  userObj.id = uuidv4();
  userObj.date = new Date().toLocaleDateString('en-GB');
  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);
      db.collection("users").insertOne(userObj, function (err, res) {
        if (err) throw err;
        client.close();
      });
    }
  );
  // Send response
  res.send(userObj);
});

app.get("/get-allUsers", function (req, res) {
  // Connect to the db
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    db.collection("users").find().toArray(function(err, result) {
      if (err) throw err;
      else if(result) {
        res.send(result);
      }
      client.close();
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
