const dotenv = require("dotenv").config();;
const mongoose  = require("mongoose");
const SeedDB    = require("./seeds");
const bodyParse = require("body-parser");
const express   = require("express");
const app       = express();
const dashboard = require("./routes/dashboard");
const post      = require("./routes/update");
const login     = require("./routes/login");
const signup    = require("./routes/signup");
//===========================================================
//Evironment Variable 
//===========================================================
//  if(app.get("env") === "development") {
//   'use strict';
//     fs = require('fs');
//     fs.createReadStream('.sample-env')
//     .pipe(fs.createWriteStream('.env'));
//  }

//===========================================================
//Setting and connecting Database to App
//===========================================================
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, })
  .then(data => console.log(`App is connected to DB petsDb4`))
  .catch(err => console.error(new Error(err)))
  
//===========================================================
// Testin with seedDB test with hard coded values
//===========================================================
//SeedDB();

//===========================================================
// THe Middleware config 
//===========================================================
// app.use((req, res, next) =>{
//   res.header('Access-Control-Allow-Origin', "*");
//   next();
// })

app.use(express.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/login", login);
app.use("/api/signup", signup);
app.use("/dashboard", dashboard);
app.use("/dashboard", post);

//===========================================================
// Setting Server Port for the App to listen to
//===========================================================
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is live on port ${port}`));