const Task = require('../models/Task');

const createTask = async (req, res) => {
  const { title, description, dueDate, status, assignedUser } = req.body;

  try {
    // Create the new task
    const task = new Task({
      title,
      description,
      dueDate,
      status,
      assignedUser,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedUser', 'name')
      .populate('comments.user', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId)
      .populate('assignedUser', 'name')
      .populate('comments.user', 'name');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, dueDate, status, assignedUser } = req.body;

  try {
    // Find the task by ID and update its properties
    let task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, status, assignedUser },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID and delete it
    const task = await Task.findByIdAndRemove(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addTaskComment = async (req, res) => {
  const taskId = req.params.id;
  const { text } = req.body;

  try {
    // Find the task by ID and add the comment
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({ text, user: req.user.id });
    await task.save();

    res.json(task.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask, addTaskComment };
