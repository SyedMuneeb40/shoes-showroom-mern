require("dotenv").config();
const config = require("./config/config")
const app = require("./app");


const PORT = process.env.PORT || config.PORT_NUMBER || 5000; 

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});



