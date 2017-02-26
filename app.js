"use strict";
// app.js

// load things we need
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const routes = require("./routes/routes.js");

// set up constants
const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE || "mongodb://public:key@ds157479.mlab.com:57479/interview"


// Set server up
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(helmet());

// set db connection

mongo.connect(DATABASE, (err, db) => {
  if (err) {
    console.log(`Database error: ${err}`);
    return;
  }
  else {
    console.log("Succesfully connected to db");
  }
  
  // Attach routes
  routes(app, db);
  
  
  app.listen(PORT, console.log(`Server listening on port ${PORT}`));
});
