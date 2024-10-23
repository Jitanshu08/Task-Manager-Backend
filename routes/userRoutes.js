const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");
const validate = require("../middleware/validate");
const auth = require("../middleware/authMiddleware");

// Registration route
router.post("/register", registerValidation, validate, registerUser);

// Login route
router.post("/login", loginValidation, validate, loginUser);

// Get logged-in user's profile (Private)
router.get("/profile", auth, getUserProfile);

// Get all users (Private, for task assignment)
router.get("/all", auth, getUsers);

// Profile update route (Private)
router.put("/profile", auth, updateUserProfile);

module.exports = router;
