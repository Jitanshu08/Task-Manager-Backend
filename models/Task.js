const mongoose = require("mongoose");

// Define Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"], // Priority options
    },
    dueDate: {
      type: Date,
      default: null, // Optional due date
    },
    status: {
      type: String,
      default: "backlog",
      enum: ["backlog", "to-do", "in-progress", "done"], // Status options
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Single assignee
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Array of users with read-only access
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checklist: {
      type: Array,
      default: [], // List of subtasks (optional)
    },
  },
  { timestamps: true }
);

// Export the Task model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
