
//Create a module that allows us to refresh the page and delete all exiting datas
const mongoose    = require("mongoose");
const Petpost  = require("./models/petpost");
const Pet = require("./models/pet");

function SeedDB(){
    
    //this data[array] was created to help create new set hard coded datas when the deleteMany function must have been executed  
    var data =  [
        { animal: "Gorrilla" },
        { animal: "Snake" },
        { animal: "Dragon" },
        { animal: "Fox" },
    ]     
    
    //Delete the Pet modules and updating the file
    Pet.deleteMany({}, err =>{
        if(err) console.log(err);
        console.log(`Removed Pet Collections / Documents`);
        
        //Delete the Petposts modules and updating the file
        Petpost.deleteMany({}, err =>{
            if(err) console.log(err);
            console.log(`Removed Petposts Collections / Documents`);
        })
                  
        //Loop through the DATA[Array] and Add or created new set of data into the Pet if no error was found
        data.forEach(seed =>{

            //Add or created new datas into the Pet Collections / Documents if no error was found
            Pet.create(seed, (err, pet) => {
                if(err) console.log(err);

                //Creating new Petposts into each Pet  
                Petpost.create({ title: "Jerry Doe", description: "This my first referencing data association" }, (err, post)=>{
                    if(!err){ 
                        pet.petposts.push(post)
                        pet.save();
                    }else{
                        console.log(`This is an error ${err}`)
                    }
                })
            });
        });
        console.log(`The Post was Created sucessful and also has some petposts`)
    });
}

module.exports = SeedDB;