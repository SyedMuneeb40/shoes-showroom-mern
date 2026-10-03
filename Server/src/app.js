const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express();
const dbConnect = require("./config/dbConfig.js")

app.use(
    cors(
        {
            origin: ["http://localhost:5173","https://shoe-showroom.netlify.app"],
            credentials: true
        }
    )
);


dbConnect();

const authRoutes = require("./routes/authRoutes.js");
const shoeRoutes = require("./routes/shoeRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js")
const paymentRoutes = require("./routes/paymentRoutes.js")


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth",authRoutes);
app.use("/api/shoes",shoeRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/payments",paymentRoutes);


module.exports = app;
