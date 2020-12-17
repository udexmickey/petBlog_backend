const mongoose = require("mongoose")
const Pet      = require("./pet")

//User MOdel And schema  Config
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      match : [/.*@..*/, "email must contain @ and ."],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: [4, "Password length should be above 4"],
      required: [true, "Password is required"]
    },
    pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ]
  });
  const User = mongoose.model("User", userSchema);

  module.exports = User