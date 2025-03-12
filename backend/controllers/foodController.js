import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food item 
const addFood = async (req,res)=>{

    let image_filename = `${req.file_filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image: req.file.filename
    })
    try{
        await food.save();
        res.json({success:true, message:"Food Added"})
    } catch(error){ 
    console.log(error)
    res.json({success:false,message:"Error"})
    }
}

//all food list
const listFood = async(req,res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

// Remove Food Items 
const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id); //To find the FoodModel by Id
        fs.unlink(`uploads/${food.image}`,()=>{}) //To delete the image from the upload section 

        await foodModel.findByIdAndDelete(req.body.id); //Deleted from mongoDB Database
        res.json({success:true,message:"Food Removed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

export {addFood,listFood,removeFood}