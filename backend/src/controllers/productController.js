const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const { search = "", category = "" } = req.query;
  const query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};

const createProduct = async (req, res) => {
  const payload = req.body;
  const product = await Product.create({
    ...payload,
    priceHistory: payload.priceHistory || [{ date: new Date(), price: payload.price }]
  });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const changedPrice = req.body.price !== undefined && req.body.price !== product.price;
  Object.assign(product, req.body);

  if (changedPrice) {
    product.priceHistory.push({ date: new Date(), price: req.body.price });
  }

  const saved = await product.save();
  return res.json(saved);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.deleteOne();
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
