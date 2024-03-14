const express = require("express")
const { registerUser, loginUser, getUser, verifyUser } = require("../controllers/userController")
const router = express()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:id",getUser)
router.post("/verify-email",verifyUser)

module.exports = router