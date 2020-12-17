app.post("/api/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, clientData) => {
    if (err) {
      console.log("Error Now you know!!!");
    } else {
      if (clientData) {
        if (clientData.password === req.body.password) {
          console.log("this is the clientdata", clientData);
          const token = jwt.sign(
            { id: clientData._id, email: clientData.email },
            "secret"
          );
          res.json({ user: clientData, token }); 
        } else {
          res.status(400).json({ message: " Incorrect Password " });
        }
      } else {
        res.status(400).json({ message: " Unknown User, please sign up " });
      }
    }
  });
}); 

app.post("/api/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const userInfo = {req.body.email, req.body.password}

  User.findOne({ email : email }, (err, clientData) => {
    if (err) {
      console.log("Error Now you know!!!");
    } else {
      if (clientData) {
        if(clientData.password === password){
          res.status(400).json({ message: " User Already existing in the Database please login" });
        }
      }else{
          User.create({ email, password });
          res.status(200).json({ email, password });
      }
    }
  })


 
});

// ///   const decoded = jwt.verify(token, "secret");
// var bcrypt = require('bcryptjs');
// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });





  const email = await req.body.email;
  const password = await req.body.password;
  User.findOne({ email: email }, async (err, clientData) => {    
    if(!err) {
        if (clientData) {
          if (clientData.password === password) return res.status(400).json({ message: " User Already existing in the Database, Please login" });
            User.create({ email, password }, async (err, newUser)=>{
          try{ 
             //creating new timed token each time a user logins in to the site
             const token = jwt.sign({ id: newUser._id, email: newUser.email }, "secret" );
            res.status(200).json({ user: newUser, token }) 
          }
          catch(e) {return res.status(404).json({message : "can't create a user now"}) }
        });
            res.status(200).json({ email, password });
        }
        User.create({ email, password }, async (err, newUser)=>{
          try{ 
             //creating new timed token each time a user logins in to the site
             const token = jwt.sign({ id: newUser._id, email: newUser.email }, "secret" );
            res.status(200).json({ user: newUser, token }) 
          }
          catch(e) {return res.status(404).json({message : "can't create a user now"}) }
        });   
    }else{
      res.status(404).json({message : "Error Catched"}) 
    }
  });
});

module.exports = router;