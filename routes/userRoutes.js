const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const { loginUser } = require("../controllers/userController");
const { loginValidation } = require("../validators/authValidator");

// Registration route
router.post("/register", registerValidation, validate, registerUser);

// Login route
router.post("/login", loginValidation, validate, loginUser);

// Placeholder for user-related routes
router.get("/", (req, res) => {
  res.send("User route placeholder");
});

module.exports = router;
