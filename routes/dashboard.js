const express = require("express")
const router     = express.Router();
const User = require("../models/user");
const Pet = require("../models/pet");
const Petpost = require("../models/petpost");
const authenthcateJWT = require("../authenthcate")
//===========================================================
//Evironment Variable 
//===========================================================
// (app.get("env") === "development")


//=========================================================================================
// THe Pet route endpoint for fetching all pet and returning back json()
//==========================================================================================

router.get("/", authenthcateJWT, (req, res) => {
  Pet.find({}, (err, pet) =>{
    if(!pet) return res.status(404).json({message : "Error!!! Can't get all pets"})
    res.status(200).json(pet)
  }) 
})

router.post("/", authenthcateJWT, async (req, res) => {
  const animal = await req.body.animal;
  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json("Only admin can post pets");
  
  Pet.create({ animal : animal}, (err, pet) => {
      try { 
        return res.status(200).json(pet); 
      }
      catch (ex) { return res.status(400).json({ message: "Can't save Pet" }); }
    })
});

router.get("/:id", authenthcateJWT, async (req, res) => {
    const petID = req.params.id;
    Pet.findById(petID).populate("petposts").exec((err, pet) => {
      if (pet) {
        try { return res.status(200).json(pet); }
        catch (e) { return res.status(400).json({ message: `can't populate the pet with the post` }); }
      }
      res.status(400).json({ message: `can't get the pet with the provided ID` });
    });
  })

router.put("/:id", authenthcateJWT, async (req, res)=>{
  const petID = req.params.id;
  const animal = await req.body.animal;

  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json("Only admin can update/change pets");

  Pet.findByIdAndUpdate({_id : petID}, { animal : animal}, {new : true}, (err, pet)=>{
    try {return res.status(200).json(pet) }
    catch (e) { return res.status(404).json({message : `An Error occurred during update/change put method`}) }
  })
})

router.delete("/:id", authenthcateJWT, async (req, res)=>{
  const petID = req.params.id;

  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json("Only admin can delete pets");

  Pet.findByIdAndRemove({_id : petID}, (err, pet)=>{
    try {return res.status(200).json({message : `This pet has been deleted `, pet}) }
    catch (e) { return res.status(404).json({message : `An Error occurred during delete method`}) }
  })
})

module.exports = router;