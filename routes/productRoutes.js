const express = require("express")
const { createProduct, getProducts, getAllProducts, getFeaturedProducts } = require("../controllers/productController")
const router = express()

router.post("/create",createProduct)

router.get("/get-products/:sellerId",getProducts)

router.get("/get-products",getAllProducts)

router.get("/get-featured-products",getFeaturedProducts)

module.exports = router