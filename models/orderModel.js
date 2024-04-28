const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  sellers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  totalAmount: { type: Number },
});

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
