const ProductModel = require("../models/productModel");
const usersModel = require("../models/userModel");

const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    const user = await usersModel.findById(userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    
    if(user.cartItems.includes(productId)){
      return res.status(400).json({success:false,message:"Product has already been added"})
    }

    await user.updateOne({ $set: { cartItems: [productId] } });

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await usersModel.findById(userId).populate("cartItems");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const cartItems = user.cartItems;

    return res
      .status(200)
      .json({
        success: true,
        message: "Cart Items fetched successfully",
        data: { content: cartItems },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await usersModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the productId exists in the user's cartItems
    const index = user.cartItems.indexOf(productId);
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    // Remove the product from the cartItems array
    const updatedCartItems = user.cartItems.filter((item,i)=>i !== index)

    await user.updateOne({$set:{cartItems:updatedCartItems}})

    return res.json({ success: true, message: "Product removed from cart", cartItems: user.cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {addToCart,removeFromCart,getCartItems}
