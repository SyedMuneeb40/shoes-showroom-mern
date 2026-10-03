require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/userSchema.js");


async function createAdmin() { 
    await mongoose.connect(process.env.MONGO_URI);   
    let admin = await UserModel.findOne(
        {email: "admin@xyz.com"}
    );

    if(!admin){
        await UserModel.create(
            {
                username: "Admin",email:"admin@xyz.com",password:"admin123",role:"admin"
            }
        );
        return console.log("Admin created");
    }else{
        return console.log("Admin Already Exists")
    }

};

createAdmin();