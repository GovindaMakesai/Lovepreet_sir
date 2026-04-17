const express = require("express");
const { predictPrice } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, predictPrice);

module.exports = router;
