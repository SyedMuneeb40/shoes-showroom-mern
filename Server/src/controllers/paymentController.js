const OrderModel = require("../models/orderSchema.js");
const PaymentModel = require("../models/paymentSchema.js");
const CartModel = require("../models/cartSchema.js")
const mongoose = require("mongoose");
const generateSignature = require("../utils/pasyfast.js");
const ShoeModel = require("../models/shoeSchema.js");

const createPayment = async (req,res) => {
    try{

        const order_Id = req.params.orderId;
        const user_Id = req.user.id;
        if(!mongoose.Types.ObjectId.isValid(order_Id)){
            return res.status(400).json({message:"Order Id is Invalid"})
        }

        const order = await OrderModel.findOne({ _id:order_Id,user:user_Id});

        if(!order){
            return res.status(404).json({message:"No Order Found With this Id"})
        }

        if(order.paymentStatus === "paid"){
            return res.status(400).json({message:"Order is already Paid"})
        }

        let existingPayment = await PaymentModel.findOne({order:order._id});
        
        if(!existingPayment){
            existingPayment = await PaymentModel.create(
                {
                    order:order._id,
                    amount:order.totalPrice,
                    provider:"PayFast",
                    paymentStatus: "pending"
                }
            );
        }else{
            existingPayment.amount = order.totalPrice;
            existingPayment.paymentStatus = "pending"

            await existingPayment.save();
        }

        const pkrAmount = Number(order.totalPrice);
        
        if (isNaN(pkrAmount) || pkrAmount <= 0) {
            return res.status(400).json({ message: "Invalid order amount in database" });
        }
        const pkrToZarRate = 0.065; 
        const convertedToZar = pkrAmount * pkrToZarRate;

        const zarFormatted = convertedToZar.toFixed(2);

        const payfastData = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY,

            return_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`,
            cancel_url:`${process.env.FRONTEND_URL}/payment/failure?orderId=${order.id}`,
            notify_url:`${process.env.BACKEND_URL}/api/payments/payfast/notify`,

            name_first:req.user.name || "customer",

            m_payment_id:existingPayment._id.toString(),
            amount:zarFormatted,
            item_name:`Order ${order._id}`
        }

        console.log("-----------------------------------------");
        console.log("PAYFAST_PASSPHRASE VALUE:", process.env.PAYFAST_PASSPHRASE);
        console.log("-----------------------------------------");

        const signature = generateSignature(payfastData,process.env.PAYFAST_PASSPHRASE);

        payfastData.signature = signature;

        return res.status(200).json({payfast_url:`${process.env.PAYFAST_URL}`,data:payfastData})

    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"})
    }
};


const payfastNotify = async (req,res)=>{
    const session = await mongoose.startSession();
    console.log("🔥 PAYFAST NOTIFY HIT");
    console.log("PAYFAST BODY:", req.body);
   
    try{
        
        let data = {...req.body}

        const payfastSignature = data.signature

        delete data.signature;

        const mypayfastSignature = generateSignature(data,process.env.PAYFAST_PASSPHRASE);


        console.log("PAYFAST SIGNATURE:", payfastSignature);
        console.log("MY SIGNATURE:", mypayfastSignature);

        if(mypayfastSignature !== payfastSignature){
            return res.status(401).json({message:"Signature mismatch"})
        }

        if(!mongoose.Types.ObjectId.isValid(data.m_payment_id)){
            return res.status(400).json({message:"payment id is Invalid"})
        }

        session.startTransaction();


        let payment = await PaymentModel.findOne({_id:data.m_payment_id}).session(session);
        if(!payment){
            await session.abortTransaction();
            return res.status(400).json("payment Not Found");
        }

        const pkrToZarRate = 0.065;
        let expectedZar = Number(payment.amount) * pkrToZarRate;
        let expectedZarFormatted = expectedZar.toFixed(2);
        let receivedZar = parseFloat(data.amount_gross).toFixed(2);

        // Currency exchange rate fluctuation ki vajah se thoda difference allow karte hain (e.g. 0.5 ZAR)
        if (Math.abs(parseFloat(expectedZarFormatted) - parseFloat(receivedZar)) > 0.5) {
            await session.abortTransaction();
            return res.status(400).send("Amount Mismatched");
        }

        if(data.payment_status !== "COMPLETE"){
            payment.paymentStatus="failed";
            await payment.save({session});
            await session.commitTransaction();
            return res.status(200).json("Payment status not complete");
        }

        if (payment.paymentStatus === "paid") {
            await session.abortTransaction();
            return res.status(200).send("Already processed");
        }

        let order = await OrderModel.findOne({_id:payment.order}).session(session);
        if(!order){
            await session.abortTransaction();
            return res.status(400).json("Order Not Found");
        }


        for(const items of order.orderItems){
            let item = await ShoeModel.findOneAndUpdate(
                {
                    _id: items.product,
                    stock:{$gte: items.quantity}
                },
                {
                    $inc:{ stock: -items.quantity}
                },
                {
                    new:true,
                    session
                }
            );

            if(!item){
                await session.abortTransaction();
                return res.status(400).json({message:"Insufficient stock"})
            }

        };

        payment.paymentStatus = "paid";
        payment.transactionId = String(data.pf_payment_id)
        payment.paidAt = new Date();

        await payment.save({session});

    

        order.paymentStatus = "paid"
        order.status = "confirmed"
        await order.save({session});

        const cart = await CartModel.findOneAndUpdate(
            {
                user: order.user
            },
            {
                $set:
                {
                    items: []
                }
            },
            {
                session
            }
        );

        

        await session.commitTransaction();
        return res.status(200).send("ok");

    }catch(error){
        console.log(error.message);
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        return res.status(500).json({message:"Server Error"})
    }finally {
        await session.endSession();
    }
};

module.exports = {createPayment,payfastNotify}