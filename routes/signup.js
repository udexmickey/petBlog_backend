const dotenv = require("dotenv").config();
const Joi = require(`joi`)
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

'use strict';
  fs = require('fs');
  fs.createReadStream('.sample-env')
  .pipe(fs.createWriteStream('.env'));

const accessTokenSecret = process.env.accessTokenSecret;

function validateValue(userValidate){
  const schema = { 
      email : Joi.string().required(),
      password : Joi.string().min(4).required(),
  }
 return Joi.validate(userValidate, schema)
}

User.findOne({email : "dimgbamicheal@ymail.com" }, (err, user)=>{
  if(user){
    console.log( "Admin already existing on the db");
  } else {
    User.create({
      email: "dimgbamicheal@ymail.com",
      password: bcrypt.hashSync(process.env.my_password, parseInt(process.env.SALT_ROUND)),
      role: "admin" 
    }) 
    console.log( "Admin was created successfully");  
  }
})

router.post("/", async (req, res) => { 
  const { error } = validateValue(req.body);
    if(error) return res.status(400).json(error.details[0].message)

    try {  
      const { email, password} = await req.body; 
 
      // Filter user from the Db by email and password and return that user  
      const findUser = await User.findOne({ email: email,});  
      if(findUser) return res.status(400).json({message : "A User with this email already existing in the Database"})
      
      //Creating new User each a user is not found on the Db
      const newUser = await User.create({ email, role: "vendor", password : bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND)), })
 
      //creating new timed token each time a user signs up in to the site
      const accessToken = jwt.sign({ role: newUser.role, email: newUser.email }, accessTokenSecret, { expiresIn: "30m" } );
      return res.status(200).json({ user: newUser, accessToken })   
    } 
    catch(e) { return res.status(404).json({message : "Error in signing up at the time try again later" }) }
});

module.exports = router;