const express = require("express")
const { addToCart, removeFromCart, getCartItems } = require("../controllers/cartController")
const router = express()

router.post("/add",addToCart)

router.delete("/remove",removeFromCart)

router.get("/get/:userId",getCartItems)

module.exports = router