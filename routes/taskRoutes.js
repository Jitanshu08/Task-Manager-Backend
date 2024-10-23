const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToUser,
} = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

// Get all tasks (Private)
router.get("/", auth, getTasks);

// Create a new task (Private)
router.post("/", auth, createTask);

// Update a task (Private)
router.put("/:id", auth, updateTask);

// Delete a task (Private)
router.delete("/:id", auth, deleteTask);

// Task assignment route
router.post("/assignTasks", auth, assignTaskToUser);

module.exports = router;
