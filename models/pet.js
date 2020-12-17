const mongoose = require("mongoose")
const Petpost      = require("./petpost")

// Pets MOdel And schema  Config
const petsSchema = new mongoose.Schema({
    animal: {
      type: String,
      required: true,
    },
    petposts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Petpost"
      }
    ]
  });
  const Pet = mongoose.model("Pet", petsSchema);

  module.exports = Pet;