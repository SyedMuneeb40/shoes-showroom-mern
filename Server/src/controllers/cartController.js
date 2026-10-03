const mongoose  = require("mongoose");
const CartModel = require("../models/cartSchema");
const ShoeModel = require("../models/shoeSchema");

const addToCart  = async (req,res) => {
    try{
        let user_id = req.user.id;
        let shoe_Id = req.params.shoeId;
        let shoe_size = req.params.shoeSize;

    if(!mongoose.Types.ObjectId.isValid(shoe_Id)){
        return res.status(400).json({
            message: "Shoe Id is invalid"
        });
    }

    let shoe = await ShoeModel.findOne(
        {
            _id: shoe_Id,
            stock: {$gte:1}
        }
    );

    if(!shoe){
        return res.status(400).json({
            message:"insufficient Stock/Shoe Not Found"
        });
    };

    let existingCart = await CartModel.findOne({
        user: user_id
    }).populate("items.shoe")

    if(!existingCart){
        let cart = await CartModel.create(
            {
                user: user_id,
                items: [
                    {
                        shoe: shoe_Id,
                        size:shoe_size,
                        quantity : 1
                    }
                ]
            }
        );
        await cart.populate("items.shoe")

        return res.status(201).json({
        message: "Shoe added to cart",
        cart: cart
    });

    }else{
        let itemIndex = existingCart.items.findIndex(items => items.shoe._id.toString() === shoe._id.toString() && items.size === Number(shoe_size));
        if(itemIndex > -1 ){
            if (existingCart.items[itemIndex].quantity >= shoe.stock) {
                return res.status(400).json({
                message: "Cannot add more than available stock"
                });
            }
            existingCart.items[itemIndex].quantity += 1;
        }else{
            existingCart.items.push(
                {
                    shoe:shoe._id,
                    size:shoe_size,
                    quantity:1
                }
            );
        };
    }


    await existingCart.save();
    await existingCart.populate("items.shoe");

    return res.status(200).json({
            message: "Shoe added to cart",
            cart: existingCart
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const removeFromCart = async (req,res)=>{
    try{
        let shoe_Id = req.params.shoeId;
        let shoe_size = Number(req.params.shoeSize)
        let user_Id = req.user.id;

          if (!mongoose.Types.ObjectId.isValid(shoe_Id)) {
            return res.status(400).json({ message: "Invalid Shoe ID format" });
        }
        
        let cart = await CartModel.findOneAndUpdate(
            {user:user_Id},
            {
                $pull:
                {
                    items: 
                    {
                        shoe: shoe_Id,
                        size: shoe_size
                    }
                }
            },
            {
                new:true
            }
        ).populate("items.shoe");

        if(!cart){
            return res.status(400).json({
                message: "Cart Not Found"
            });
        }

        return res.status(200).json({
            message: "Shoe removed from cart",
            cart: cart
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const increaseQuantity = async (req,res)=>{
   try{
    let shoe_Id = req.params.shoeId;
    let shoe_size = Number(req.params.shoeSize);
    let user_Id = req.user.id;
    

    if (!mongoose.Types.ObjectId.isValid(shoe_Id)) {
            return res.status(400).json({
                message: "Invalid Shoe ID"
            });
    }

    let shoe = await ShoeModel.findById(shoe_Id);

    if(!shoe){
        return res.status(400).json({message:"shoe Id is Invalid"})
    };

    let cart = await CartModel.findOneAndUpdate(
        {
            user:user_Id,
            items:
            {
                $elemMatch:
                {
                    shoe: shoe_Id,
                    size:shoe_size,
                    quantity : 
                    {
                        $lt: shoe.stock
                    }
                }
            }
        },
        {
            $inc:
            {
                "items.$.quantity":1
            }
        },
        {
            new:true
        }
    ).populate("items.shoe");

    if (!cart) {
        return res.status(400).json({
            message: "Cannot increase quantity. Stock limit reached or item not found."
        });
    }

      return res.status(200).json({
            message: "Quantity increased",
            cart
        });
   }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Server error"
        });
   };
};


const decreaseQuantity = async (req,res)=>{
   try{
    let shoe_Id = req.params.shoeId;
    let shoe_size = Number(req.params.shoeSize)
    let user_Id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(shoe_Id)) {
        return res.status(400).json({
            message: "Invalid Shoe ID"
        });
    }

    const cart = await CartModel.findOne({
        user:user_Id,
        "items.shoe": shoe_Id
    });
    
        if (!cart) {
            return res.status(404).json({
                message: "Shoe not found in cart"
            });
        }

        let item = cart.items.find(item => item.shoe.toString() === shoe_Id.toString() &&
        item.size === shoe_size);

        if (!item) {
            return res.status(404).json({
                message: "Shoe not found in cart"
            });
        }

        if(item.quantity === 1){
            const updatedCart = await CartModel.findOneAndUpdate(
                {user:user_Id},
                {
                    $pull:
                    {
                        items : {
                            shoe : shoe_Id,
                            size:shoe_size
                        }
                    }
                },
                {
                    new:true
                }
            ).populate("items.shoe")

            return res.status(200).json({
                message: "Shoe removed from cart",
                cart: updatedCart
            });
        }

    const updatedCart = await CartModel.findOneAndUpdate(
        {
            user:user_Id,
            items:
            {
                $elemMatch:
                {
                    shoe: shoe_Id,
                    size:shoe_size,
                    quantity : 
                    {
                        $gt: 1
                    }
                }
            }
        },
        {
            $inc:
            {
                "items.$.quantity": -1
            }
        },
        {
            new:true
        }
    ).populate("items.shoe")

       return res.status(200).json({
            message: "Quantity decreased",
            cart: updatedCart
        })
   } catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Server error"
        });
   };
};


const getCart = async (req,res)=>{
    try{
        const user_Id = req.user.id;

        let cart = await CartModel.findOne({
            user: user_Id
        }).populate("items.shoe");

        
        if (!cart) {
            return res.status(200).json({
                 cart: {
                    items: []
                }
            });
        }

        return res.status(200).json({
            cart
        });    


    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {addToCart,removeFromCart,increaseQuantity,decreaseQuantity,getCart};


