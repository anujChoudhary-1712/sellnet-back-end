const ProductModel = require("../models/productModel");
const usersModel = require("../models/userModel");
const OrderModel = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const { buyerId } = req.body;

    const buyer = await usersModel.findById(buyerId).populate("cartItems");
    if (!buyer)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const cartItems = buyer.cartItems;

    let products = [];
    let sellers = [];
    let totalAmount = 0;
    for (let cart of cartItems) {
      products.push(cart._id);
      totalAmount += cart.price;
      if (!sellers.includes(cart.sellerId)) {
        sellers.push(cart.sellerId);
      }
    }

    const order = await OrderModel.create({
      buyerId,
      sellers,
      products,
      totalAmount,
    });
    await buyer.updateOne({ $set: { orders: [order._id], cartItems: [] } });

    for (let sellerId of order.sellers) {
      await usersModel.findByIdAndUpdate(sellerId, {
        orders: [order._id],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order processed successfully",
      orderId: order._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Assuming the parameter should be 'userId' not 'buyerId' since it's fetched from req.params
    const user = await usersModel.findById(userId).populate("orders");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    let orders = [];

    for (let orderId of user.orders) {
      const order = await OrderModel.findById(orderId)
        .populate("products")
        .populate("buyerId")
        .populate("sellers");
      orders.push(order);
    }

    return res.json({
      success: true,
      message: "orders fetched successfully",
      data: { content: orders },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId)
      .populate("products")
      .populate("buyerId")
      .populate("sellers");

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "order fetched successfully",
      data: { content: order },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, fetchOrders, fetchOrder };
