const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman/curl and same-origin server-to-server calls
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: origin not allowed"));
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("AI e-commerce API running"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/recommendations", require("./routes/recommendationRoutes"));
app.use("/api/price-predict", require("./routes/pricePredictionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
