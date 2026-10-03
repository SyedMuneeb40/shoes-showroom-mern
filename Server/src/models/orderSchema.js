const mongoose = require("mongoose");
const {orderItemsModel,orderItemsSchema} = require("./orderItems")

const orderSchema = new mongoose.Schema(
    {
        user:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        orderItems: [orderItemsSchema],
        totalPrice:
        {
            type:Number,
            required:true
        },
        status:
        {
            type:String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        paymentStatus:
        {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    },
    {
        timestamps:true
    }
);

const OrderModel = mongoose.model("Order",orderSchema);

module.exports = OrderModel;