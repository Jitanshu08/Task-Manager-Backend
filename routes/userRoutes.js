const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const { loginUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const { loginValidation } = require("../validators/authValidator");
const { getUsers } = require('../controllers/userController');
const { updateUserProfile } = require('../controllers/userController');

// Registration route
router.post("/register", registerValidation, validate, registerUser);

// Login route
router.post("/login", loginValidation, validate, loginUser);

// Get all users (Private, for task assignment)
router.get('/all', auth, getUsers);

// Profile update route (Private)
router.put("/profile", auth, updateUserProfile);

// Placeholder for user-related routes
router.get("/", (req, res) => {
  res.send("User route placeholder");
});

module.exports = router;
