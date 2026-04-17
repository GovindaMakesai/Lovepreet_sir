const express = require("express");
const { getRecommendations } = require("../controllers/aiController");

const router = express.Router();

router.get("/", getRecommendations);

module.exports = router;
