const express = require("express");
const { body } = require("express-validator");
const { signup, login, profile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password should be at least 6 chars")
  ],
  signup
);

router.post("/login", login);
router.get("/me", protect, profile);

module.exports = router;
