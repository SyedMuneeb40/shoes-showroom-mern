const OrderModel = require("../models/orderSchema.js");
const CartModel = require("../models/cartSchema.js");
const mongoose = require("mongoose");


const placeOrder = async (req,res)=>{
    try{

        const user_Id = req.user.id;

        let cart = await CartModel.findOne({user:user_Id}).populate("items.shoe");

        if(!cart){
            return res.status(404).json({message:"Cart Id is Invalid"})
        };

        if(cart.items.length === 0){
            return res.status(400).json({message:"Cart is empty"})
        }

        const orderitems = [];
        let totalprice = 0;

        for(const items of cart.items){
            let shoe = items.shoe;
            if(!shoe){
                return res.status(404).json({message:"Shoe ID is invalid"})
            };

            const quantity = items.quantity;
            const price = shoe.price;
            const itemTotal = quantity * price;
            const shoe_size = items.size;
            orderitems.push({
                product: shoe._id,
                size:shoe_size,
                price: price,
                quantity: quantity
            });

            totalprice += itemTotal;
        } 

            const order = await OrderModel.create({
                user:user_Id,
                orderItems:orderitems,
                totalPrice:totalprice,
            });

            return res.status(201).json({message: "Order Created Successfully",order:order});
    

    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:"Server Error"})
    }
};


const cancelOrder = async (req,res)=>{
    try{
        const user_Id = req.user.id;
        const order_Id = req.params.orderId;

        if(!mongoose.Types.ObjectId.isValid(order_Id)){
            return res.status(400).json({message:"Invalid Order Id"})
        };

        let order = await OrderModel.findOne({_id:order_Id , user:user_Id});
        if(!order){
            return res.status(404).json({message:"Order Not Found"})
        }

        if(order.status === "shipped" || order.status === "delivered"){
            return res.status(400).json({message: "Cannot Cancel Order"})
        }

        if(order.status === "cancelled"){
            return res.status(400).json({
                message: "Order is already cancelled"
            });
        }

        order.status = "cancelled";

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"})
    }
};


const getOrder = async (req,res)=>{
    try{
    const user_Id = req.user.id;
    const order_Id= req.params.orderId;
    
    if(!mongoose.Types.ObjectId.isValid(order_Id)){
        return res.status(400).json({message:"Order Id is invalid"})
    }

    let order = await OrderModel.findOne({user: user_Id , _id:order_Id}).populate("orderItems.product");

    if(!order){
        return res.status(404).json({message:"Order Not Found"})
    };

    return res.status(200).json({
        message:"successfully found order with given id",    
        order:order
        });
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message: "Server Error"})
    }
}

const getOrders = async (req,res)=>{
    try{
        const user_Id = req.user.id;

        let orders = await OrderModel.find({user:user_Id}).populate("orderItems.product").sort({createdAt: -1});

        return res.status(200).json({message: "Orders Found" , orders: orders})
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"})
    }
};


const getAllOrders = async (req, res) => {
    try {

        const orders = await OrderModel
            .find()
            .populate("user", "username email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All orders found",
            orders
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {

        const order_Id = req.params.orderId;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(order_Id)) {
            return res.status(400).json({
                message: "Invalid Order Id"
            });
        }

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await OrderModel.findById(order_Id);

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
            });
        }

        const allowedTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };

        if (!allowedTransitions[order.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot change order status from ${order.status} to ${status}`
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};


module.exports= {placeOrder,cancelOrder,getOrder,getOrders,getAllOrders,updateOrderStatus};