const Task = require("../models/Task");


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.createTask = async (req, res) => {
  const { title, priority, dueDate, checklist } = req.body;

  if (!title || !priority) {
    return res.status(400).json({ message: "Title and priority are required" });
  }

  try {
    const task = await Task.create({
      title,
      priority,
      dueDate,
      checklist,
      assignee: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateTask = async (req, res) => {
  const { title, priority, dueDate, status, checklist } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.assignee.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.checklist = checklist || task.checklist;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.assignee.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    await task.remove();
    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
