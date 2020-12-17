const express = require("express")
const router     = express.Router();
const User = require("../models/user");
const Pet = require("../models/pet");
const Petpost = require("../models/petpost");

//=========================================================================================
// THe Pet route endpoint for fetching all pet and returning back json()
//==========================================================================================

router.get("/", (req, res) => {
  Pet.find({}, (err, pet) =>{
    if(err) return res.status(404).json({message : "Error!!! Can't get all pets"})
    return res.status(200).json(pet)
  })
})

router.post("/", async (req, res) => {
  const animal = await req.body.animal;
  Pet.create({ animal : animal}, (err, pet) => {
      try { return res.status(200).json(pet); }
      catch (ex) { return res.status(400).json({ message: "Can't save Pet" }); }
    })
});

router.get("/:id", async (req, res) => {
    const petID = req.params.id;
    Pet.findById(petID).populate("petposts").exec((err, pet) => {
      if (pet) {
        try { return res.status(200).json(pet); }
        catch (e) { return res.status(400).json({ message: `can't populate the pet with the post` }); }
      }
      res.status(400).json({ message: `can't get the pet with the provided ID` });
    });
  })

router.put("/:id", async (req, res)=>{
  const petID = req.params.id;
  const animal = await req.body.animal;
  Pet.findByIdAndUpdate({_id : petID}, { animal : animal}, {new : true}, (err, pet)=>{
    try {return res.status(200).json(pet) }
    catch (e) { return res.status(404).json({message : `An Error occurred during update put method`}) }
  })
})

router.delete("/:id", async (req, res)=>{
  const petID = req.params.id;
  Pet.findByIdAndRemove({_id : petID}, (err, pet)=>{
    try {return res.status(200).json({message : `This pet has been deleted `, pet}) }
    catch (e) { return res.status(404).json({message : `An Error occurred during delete method`}) }
  })
})

module.exports = router;