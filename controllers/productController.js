const ProductModel = require("../models/productModel");
const productModel = require("../models/productModel");
const usersModel = require("../models/userModel");

const createProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, fileUrl, category, price, sellerId } =
      req.body;

    if (!name || !description || !imageUrl || !fileUrl || !category || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the details" });
    }

    if (!sellerId) {
      return res
        .status(400)
        .json({ success: false, message: "seller id is missing" });
    }

    const user = await usersModel.findById(sellerId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "seller not found" });
    }

    const product = await productModel.create({
      name,
      description,
      imageUrl,
      fileUrl,
      category,
      price,
      sellerId,
    });

    // Get existing product IDs from seller's account
    const existingProducts = user.products || [];
    // Add new product ID to the array
    const updatedProducts = [...existingProducts, product._id];

    // Update seller's account with the new array of product IDs
    await usersModel.findByIdAndUpdate(sellerId, { products: updatedProducts });

    return res.status(200).json({
      success: true,
      message: "Product Created Successfully",
      data: {
        content: product,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await usersModel.findById(sellerId).populate("products");
    if (!seller) {
      return res
        .status(400)
        .json({ success: false, message: "seller not found" });
    }
    const products = seller.products;
    return res.status(200).json({
      success: true,
      message: "Products fetched Successfully",
      data: {
        content: products,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Product found" });
    }

    let featuredProducts = [];
    if (products.length > 4) {
      featuredProducts = products.splice(0, 4);
    } else {
      featuredProducts = products;
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched Successfully",
      data: {
        content: featuredProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Product found" });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched Successfully",
      data: {
        content: products,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Product fetched successfully",
        data: { content: product },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getAllProducts,
  getFeaturedProducts,
  getSingleProduct
};
