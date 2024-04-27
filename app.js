const express = require('express')
const dotenv = require("dotenv");
const dbConnect = require('./config/mongodb');
const app = express()
const cors = require("cors")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const cartRouter = require("./routes/cartRoutes")
dotenv.config()

// connecting to db successfully
dbConnect()

app.use(express.json())
app.use(cors())

// routes
app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)

module.exports = app