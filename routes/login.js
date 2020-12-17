const express = require("express")
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, (err, clientData) => {
    if (err) console.log("Error as occured, Can't find Users!!!");
      if (clientData) {
        if (clientData.password === req.body.password) {
            //creating new timed token each time a user logins in to the site
            const token = jwt.sign({ id: clientData._id, email: clientData.email }, "secret" );
            res.status(200).json({ user: clientData, token });
        } else {
          res.status(400).json({ message: "Correct Password is required " });
          }
      } else { 
        res.status(404).json({ message: " Unknown User" }) 
      }
  });
});

  module.exports = router;