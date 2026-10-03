const ShoeModel = require("../models/shoeSchema.js");
const uploadToCloudinary = require("../utils/cloudinaryUtils.js")


const getShoes = async (req,res)=>{
    try{
        const shoes = await ShoeModel.find().sort({createdAt : -1});
        return res.status(200).json(shoes);
    }catch(error){
        console.log(error.message);
    }
};

const getShoe = async (req,res)=>{
    try{
        let shoe_id = req.params.id;
        let shoe = await ShoeModel.findById(shoe_id);
        if(!shoe){
            return res.status(404).json({message:"Shoe Not found"})
        }
        return res.status(200).json(shoe)
    }catch(error){
        console.log(error.message);
    }
};

const createShoe = async (req,res)=>{
    try{
        const {name, brand, price, description, stock} = req.body;
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }
        const imageBuffer = req.file.buffer;
        const sizes = JSON.parse(req.body.sizes);


        const cloudinaryResult = await uploadToCloudinary(imageBuffer);
        const image = cloudinaryResult.secure_url;

        let shoe = await ShoeModel.create({
            name,brand,price,description,image,sizes,stock,
            createdBy: req.user.id
        });
        return res.status(201).json(shoe);
    }catch(error){
        console.log(error.message);
    }
};

const updateShoe = async (req,res)=>{
    let updatedShoe = await ShoeModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updatedShoe){
        return res.status(404).json({message:"Shoe not found with this id"})
    }
    return res.status(200).json(updatedShoe);
}

const deleteShoe = async (req,res)=>{
    let deletedShoe = await ShoeModel.findByIdAndDelete(req.params.id);
    if(!deletedShoe){
        return res.status(404).json({message:"Shoe not found with this id"})
    }
    return res.status(200).json({message:"Successfully Deleted"})
}

module.exports = {getShoes,getShoe,createShoe,updateShoe,deleteShoe};