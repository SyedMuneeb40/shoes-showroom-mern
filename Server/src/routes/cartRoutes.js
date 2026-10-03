const express = require("express");
const cartRoutes = express.Router();
const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getCart } = require("../controllers/cartController.js");
const {protect,authorize} = require("../middleware/auth.js")


cartRoutes.post("/:shoeId/:shoeSize",protect,authorize("customer"),addToCart);
cartRoutes.get("/",protect,authorize("customer"),getCart);
cartRoutes.patch("/increase/:shoeId/:shoeSize",protect,authorize("customer"),increaseQuantity);
cartRoutes.patch("/decrease/:shoeId/:shoeSize",protect,authorize("customer"),decreaseQuantity);
cartRoutes.delete("/remove/:shoeId/:shoeSize",protect,authorize("customer"),removeFromCart);


module.exports = cartRoutes;