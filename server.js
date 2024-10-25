const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes.js");

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON

// Enable CORS with dynamic origin (handle both local and production)
app.use(
  cors({
    origin: [
      "https://task-manager-frontend-ih9lr5uzr-jitanshu-shaws-projects.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Database connection
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling (can be expanded later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Server Error" });
});

// Define the PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
