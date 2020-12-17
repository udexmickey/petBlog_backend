const express = require("express")
const router     = express.Router();
const User = require("../models/user");
const Pet = require("../models/pet");
const Petpost = require("../models/petpost");

// router.get("/", (req, res) => {
//   Petpost.find({}, (err, post) =>{
//     if(err) return res.status(404).json({message : "Error!!! Can't get all posts"})
//     return res.status(200).json(post)
//   })
// })

//=========================================================================================
// THe PetPost route endpoint all associated to a particular pet ID
//========================================================================================== 

router.post("/:id/posts", async (req, res) => {
  Pet.findById(req.params.id, (err, pet)=>{
    try { 
      Petpost.create({ title : req.body.title, description : req.body.description }, (err, update) => {
        try {
          pet.petposts.unshift(update)
          pet.save()  
          res.status(200).json(pet)
        }
        catch(e){ return res.status(400).json({ message: "Can't push Petspost to the pet with this Id" }) }
      })
    } 
    catch(e) { return res.status(404).json({ message: "Sorry Can't join pet and post at this time" }) }
  })
});

router.get("/:id/posts/:id", async (req, res)=>{
  const postID = req.params.id;
  Petpost.findById({_id : postID}, (err, post)=>{
    try {return res.status(200).json(post) }
    catch (e) { return res.status(400).json({message : `can't get the post with ID`}) }
  })
})

router.put("/:id/posts/:id", async (req, res)=>{
  const postID = req.params.id;
  const title = await req.body.title;
  const description = await req.body.description;
  Petpost.findByIdAndUpdate({_id : postID}, { title : title, description : description}, {new : true}, (err, post)=>{
    try {return res.status(200).json(post) }
    catch (e) { return res.status(404).json({message : `An Error occurred during update put method`}) }
  })
})

router.delete("/:id/posts/:id", async (req, res)=>{
  const postID = req.params.id;
  Petpost.findByIdAndRemove({_id : postID}, (err, post)=>{
    try {return res.status(200).json({message : `This petpost has been deleted for the Pet with the PetID`, post}) }
    catch (e) { return res.status(404).json({message : `An Error occurred during delete method`}) }
  })
})

module.exports = router;