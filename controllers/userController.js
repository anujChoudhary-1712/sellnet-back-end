const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendTransporter = require("../utils/sendTransporter");

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, companyName, accountType } = req.body;

    if (!fullname || !email || !password || !accountType) {
      return res.status(400).json({ message: "Fill all the required details" });
    }

    if (accountType === "seller" && !companyName) {
      return res.status(400).json({ message: "company name is required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let user;
    if (accountType === "seller") {
      user = await userModel.create({
        fullname,
        email,
        password:hashPassword,
        accountType,
        companyName,
        emailToken: crypto.randomBytes(64).toString("hex"),
      });
    } else {
      user = await userModel.create({
        fullname,
        email,
        password:hashPassword,
        accountType,
        emailToken: crypto.randomBytes(64).toString("hex"),
      });
    }

    sendTransporter(user)

    return res
      .status(200)
      .json({ message: "Email verification has been sent successfully",emailToken:user.emailToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    // get all the required data
    const { email, password } = req.body;
    if (!(email && password))
      return res.status(400).json({ message: "Please add details!" });

    // find user in DB
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    if(!user.emailVerified) return res.status(400).json({ message: "Email has not been verified" });

    // match the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid Email or Password!" });

    const token = jwt.sign(
      { id: user._id, email: user.email, accountType: user.accountType },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({
      success: true,
      token: token,
      message: "You have logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { emailToken } = req.body;
    if (!emailToken)
      return res.status(400).json({ message: "email token not found" });

    const user = await userModel.findOne({ emailToken });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.emailToken = null;
    user.emailVerified = true;

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, accountType: user.accountType },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({user,token})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUser,verifyUser };
