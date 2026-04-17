const Order = require("../models/Order");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

const createOrder = async (req, res) => {
  const { items } = req.body;
  if (!items?.length) return res.status(400).json({ message: "No order items" });

  const normalized = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: "Product not found" });
    normalized.push({ product: product._id, quantity: item.quantity, price: product.price });
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({ user: req.user._id, items: normalized, totalPrice, status: "paid" });
  await Transaction.create({ order: order._id, user: req.user._id, amount: totalPrice, status: "success" });

  return res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product", "name image");
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

module.exports = { createOrder, getMyOrders, getAllOrders };
