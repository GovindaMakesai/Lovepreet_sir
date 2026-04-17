const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/token");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });
  return res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  return res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

const profile = async (req, res) => res.json(req.user);

module.exports = { signup, login, profile };
