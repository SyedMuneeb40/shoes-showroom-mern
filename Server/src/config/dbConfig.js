const config = require("./config")
const mongoose = require("mongoose")

const dbConnect = async ()=>{
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("Database Successfully Connected")
    }catch(error){
        console.log("Database Not Connected" + error.message); 
    }
};

module.exports = dbConnect;