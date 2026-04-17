const Product = require("../models/Product");

const getRecommendations = async (req, res) => {
  const { productId, category } = req.query;

  if (productId) {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const similar = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(6);
    return res.json(similar);
  }

  if (category) {
    const list = await Product.find({ category }).limit(6);
    return res.json(list);
  }

  const latest = await Product.find().sort({ createdAt: -1 }).limit(6);
  return res.json(latest);
};

const predictPrice = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const history = product.priceHistory || [];
  if (history.length < 2) {
    return res.json({
      productId,
      predictedPrice: product.price,
      note: "Not enough history, returning current price"
    });
  }

  // Simple linear regression: x = index, y = price
  const n = history.length;
  const x = history.map((_, i) => i + 1);
  const y = history.map((point) => point.price);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, current, i) => acc + current * y[i], 0);
  const sumXX = x.reduce((acc, current) => acc + current * current, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const nextX = n + 1;
  const predictedPrice = Number((slope * nextX + intercept).toFixed(2));
  res.json({ productId, predictedPrice, currentPrice: product.price, pointsUsed: n });
};

module.exports = { getRecommendations, predictPrice };
