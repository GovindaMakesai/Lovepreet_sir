const mongoose = require("mongoose");

const pricePointSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    priceHistory: [pricePointSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
