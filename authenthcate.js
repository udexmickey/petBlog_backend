const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.accessTokenSecret;
 
function authenthcateJWT (req, res, next) {

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    // verification of secret to match a the secret in the login route
    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user;
      next();
    });
  } else{
      res.sendStatus(401);
  }
};

module.exports = authenthcateJWT;