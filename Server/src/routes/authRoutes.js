const {protect} = require("../middleware/auth.js");
const express = require("express");
const {register,login,refresh,logout,me} = require("../controllers/authController.js")
const authRoute = express.Router();

authRoute.post("/register",register);
authRoute.post("/login",login);
authRoute.post("/refresh",refresh);
authRoute.post("/logout",logout);
authRoute.get("/me",protect,me);

module.exports = authRoute;