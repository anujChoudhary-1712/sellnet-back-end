const express = require("express")
const { fetchOrders, createOrder, fetchOrder } = require("../controllers/orderController")
const router = express()

router.get("/getOrders/:userId",fetchOrders)

router.get("/getOrder/:orderId",fetchOrder)

router.post("/create",createOrder)

module.exports = router