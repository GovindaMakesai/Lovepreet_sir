const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.get("/orders", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
});

module.exports = router;
