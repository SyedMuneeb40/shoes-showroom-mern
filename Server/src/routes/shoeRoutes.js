const {protect,authorize} = require("../middleware/auth.js");
const upload = require("../middleware/upload.js")
const express = require("express");
const  {getShoes,getShoe,createShoe,updateShoe,deleteShoe} = require("../controllers/shoeController.js")

const shoeRoutes = express.Router();

shoeRoutes.get("/",getShoes);
shoeRoutes.get("/:id",getShoe);


shoeRoutes.post("/",protect,authorize("admin"),upload.single("image"),createShoe);
shoeRoutes.put("/:id",protect,authorize("admin"),updateShoe);
shoeRoutes.delete("/:id",protect,authorize("admin"),deleteShoe);

module.exports = shoeRoutes;