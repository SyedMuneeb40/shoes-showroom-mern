const express = require("express");
const {protect,authorize} = require("../middleware/auth.js")
const {createPayment , payfastNotify} = require("../controllers/paymentController.js")
const paymentRoutes = express.Router();

paymentRoutes.post("/create/:orderId",protect,authorize("customer"), createPayment);
paymentRoutes.post("/payfast/notify",payfastNotify)


module.exports = paymentRoutes;