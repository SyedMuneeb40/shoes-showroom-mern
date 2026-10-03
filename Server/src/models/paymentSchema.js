const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(
    {
        order:
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Order"
        },
        transactionId:
        {
            type:String,
            unique:true,
            sparse:true
        },
        amount: 
        {
            type:Number,
            required:true
        },
        provider:
        {
            type:String,
            enum:["PayFast","Jazzcash"],
            default: "PayFast",
            required:true
        },
        paymentStatus:
        {
            type:String,
            enum:["pending","paid","failed"],
            default:"pending"
        },
        paidAt:
        {
            type: Date
        }

    },
    {
        timestamps:true
    }
);

const PaymentSchema = mongoose.model("Payment",paymentSchema);
module.exports = PaymentSchema;