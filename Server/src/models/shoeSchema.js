const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: [true,"Shoe name must be required"]
        },
        brand:
        {
            type: String,
            required: [true,"brand name must be required"]
        },
        price:
        {
            type: Number,
            required: [true,"Price must be required"]
        },
        description:
        {
            type: String,
            required: [true,"Description must be required"]
        },
        image:
        {
            type:String,
            required: [true,"image url must be required"]
        },
        sizes:
        {
            type: [Number],
            required: [true,"Sizes must be required"]
        },
        stock:
        {
            type: Number,
            default: 0
        },
        createdBy:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"

        }
    },
    {
        timestamps:true
    }
);

const ShoeModel = mongoose.model("Shoe",shoeSchema);
module.exports = ShoeModel;

