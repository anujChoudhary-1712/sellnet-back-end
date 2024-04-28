const express = require("express")
const { createCheckoutSession } = require("../controllers/paymentController")
const router = express()

router.post("/create-checkout-session",createCheckoutSession)

module.exports = router