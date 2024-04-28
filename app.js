const express = require('express')
const dotenv = require("dotenv");
const dbConnect = require('./config/mongodb');
const app = express()
const cors = require("cors")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const cartRouter = require("./routes/cartRoutes")
const paymentRouter = require("./routes/paymentRoutes")
dotenv.config()

// connecting to db successfully
dbConnect()

app.use(express.json())
app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials:true,
      optionsSuccessStatus: 200,
    })
  );
// routes
app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/payment",paymentRouter)

module.exports = app