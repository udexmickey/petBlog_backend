const dotenv = require("dotenv").config();
const express = require("express")
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const accessTokenSecret = process.env.accessTokenSecret;
const refreshTokenSecret = process.env.refreshTokenSecret;
const refreshTokens = [];

router.post("/", async (req, res) => {
    try {
      // Read email and password from request body
      const { email, password } = req.body;

      // Filter user from the Db by email and password and return that user
      const user = await User.findOne({ email: email,});            
      if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: "Correct Password is required " });

      // Generate an access token
      const accessToken = jwt.sign({ role: user.role, email: user.email }, accessTokenSecret, { expiresIn: "30m" });
      const refreshToken = jwt.sign({ role: user.role, email: user.email }, refreshTokenSecret);

      refreshTokens.push(refreshToken);
      return res.status(200).json({ user: user, accessToken, refreshToken });
    } 
    catch(e) { return res.status(404).json({message : "Incorrect User email"}); }
});

router.post("/token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
        
    const accessToken = jwt.sign({ role: user.role, email: user.email }, accessTokenSecret, { expiresIn: "20m" });
    return res.status(200).json({ accessToken });
    });
}); 

router.post("/logout", (req, res) => {
    const { token } = req.body;
    refreshTokens.filter(t => t !== token);

    return res.status(200).json("Logout successful");
});
  module.exports = router;