const mongoose = require("mongoose");

// Activity schema for daily pet posts
const petPostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });
  const Petpost = mongoose.model("Petpost", petPostSchema);

  module.exports = Petpost;