const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();

const seed = async () => {
  await connectDB();
  const filePath = path.join(__dirname, "..", "data", "sampleProducts.json");
  const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Sample products inserted");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
