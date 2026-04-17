const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: "card" },
    status: { type: String, enum: ["success", "failed"], default: "success" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
