const express = require("express");
const {protect,authorize} = require("../middleware/auth.js");
const { getOrders, getOrder, placeOrder, getAllOrders,updateOrderStatus , cancelOrder } = require("../controllers/orderController");

const orderRoutes = express.Router();

orderRoutes.get(`/admin/orders`,protect,authorize("admin"),getAllOrders);
orderRoutes.patch(`/admin/:orderId/status`,protect,authorize("admin"),updateOrderStatus);

orderRoutes.get("/",protect,authorize("customer"),getOrders);
orderRoutes.get("/:orderId",protect,authorize("customer"),getOrder);
orderRoutes.post("/checkout",protect,authorize("customer"),placeOrder);
orderRoutes.patch("/:orderId/cancel",protect,authorize("customer"),cancelOrder);


module.exports = orderRoutes;