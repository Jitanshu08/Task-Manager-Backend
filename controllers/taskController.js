const Task = require("../models/Task");
const User = require("../models/User");

// Controller to assign task to user by email
exports.assignTaskToUser = async (req, res) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all tasks created by the current user (the one adding the email)
    const tasks = await Task.find({ creator: req.user._id });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found to assign" });
    }

    // Loop through each task and add the user to the sharedWith array
    for (let task of tasks) {
      if (!task.sharedWith.includes(user._id)) {
        task.sharedWith.push(user._id);
        await task.save();
      }
    }

    res
      .status(200)
      .json({ message: `${email} assigned to all tasks successfully` });
  } catch (error) {
    console.error("Error assigning tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  const { filter } = req.query;

  let filterConditions = {
    $or: [
      { assignee: req.user._id }, 
      { creator: req.user._id }, 
      { sharedWith: req.user._id }, 
    ],
  };

  try {
    const today = new Date();
    let startOfWeek, endOfWeek, startOfMonth, endOfMonth;

    switch (filter) {
      case "today":
        filterConditions.dueDate = {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lte: new Date(today.setHours(23, 59, 59, 999)),
        };
        break;
      case "thisWeek":
        startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
        endOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        ); // End of the week
        filterConditions.dueDate = {
          $gte: startOfWeek,
          $lte: endOfWeek,
        };
        break;
      case "thisMonth":
        startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
        endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the month
        filterConditions.dueDate = {
          $gte: startOfMonth,
          $lte: endOfMonth,
        };
        break;
      default:
        // No due date filter applied
        break;
    }

    // Fetch tasks with the filter conditions
    const tasks = await Task.find(filterConditions);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createTask = async (req, res) => {
  const { title, priority, dueDate, checklist, assignee, sharedWith } =
    req.body;

  try {
    const task = await Task.create({
      title,
      priority,
      dueDate,
      checklist,
      assignee,
      sharedWith,
      creator: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error); // Log error to inspect
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  const { title, priority, dueDate, status, checklist } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // the logged-in user can be either the creator or the assignee
    if (
      task.assignee &&
      task.assignee.toString() !== req.user._id.toString() &&
      task.creator.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update task fields
    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.checklist = checklist || task.checklist;

    // Save the updated task
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    //the logged-in user can be either the creator or the assignee
    if (
      task.assignee &&
      task.assignee.toString() !== req.user._id.toString() &&
      task.creator.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
