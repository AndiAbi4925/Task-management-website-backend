// src/controllers/taskController.js
const prisma = require('../utils/prisma');

// 1. Get All Tasks (Only for the logged-in user)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId }, // <--- MAGIC: Only get MY tasks
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        userId: req.user.userId // <--- Connect task to the user
      }
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};