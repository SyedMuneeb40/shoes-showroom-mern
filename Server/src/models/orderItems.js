const mongoose = require("mongoose");


const orderItemsSchema = new mongoose.Schema(
    {
        product:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shoe"
        },
        size:
        {
            type:Number,
            required:true
        },
        price:
        {
            type: Number,
            required:true
        },
        quantity:
        {
            type:Number,
            min:1,
            required:true
        }
    },
    {
        _id: false
    }
);

const orderItemsModel = mongoose.model("orderItem",orderItemsSchema);

module.exports = {orderItemsModel,orderItemsSchema};