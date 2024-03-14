const express = require('express')
const dotenv = require("dotenv");
const dbConnect = require('./config/mongodb');
const app = express()
const cors = require("cors")
const userRouter = require("./routes/userRoutes")
dotenv.config()

// connecting to db successfully
dbConnect()

app.use(express.json())
app.use(cors())

// routes
app.use("/api/users",userRouter)

module.exports = app