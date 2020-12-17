const Joi = require(`joi`)
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function validateValue(userValidate){
  const schema = { 
      email : Joi.string().required(),
      password : Joi.string().min(4).required(),
  }
 return Joi.validate(userValidate, schema)
}

router.post("/", async (req, res) => {
  const { error } = validateValue(req.body);
    if(error) return res.status(400).json(error.details[0].message)

  const email = await req.body.email;
  const password = await req.body.password;

  User.findOne({ email: email }, async (err, clientData) => {    
    try {
      if (clientData) return res.status(400).json({ message: " User with this email already existing in the Database" });

      User.create({ email, password }, async (err, newUser)=>{
        try { 
          //creating new timed token each time a user logins in to the site
          const token = jwt.sign({ id: newUser._id, email: newUser.email }, "secret" );
          res.status(200).json({ user: newUser, token }) 
        }
        catch(e) {return res.status(400).json({message : "can't create a user now"}) }
      });   
    } 
    catch(e) { return res.status(404).json({message : "Error Catched"}) }
  });
});

module.exports = router;