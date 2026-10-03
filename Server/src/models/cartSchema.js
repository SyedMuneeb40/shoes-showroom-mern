const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true,"User must be required"],
            unique:true
        },
        items:
        [
            {
                shoe: 
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Shoe",
                    required:[true,"shoe must be required"]
                },

                size:
                {
                    type:Number,
                    required:true
                },
                quantity:
                {
                    type:Number,
                    required: true,
                    min:1
                }
            }
        ]
    },
    {
        timestamps:true
    }
);

const CartModel = mongoose.model("Cart",cartSchema);

module.exports = CartModel;