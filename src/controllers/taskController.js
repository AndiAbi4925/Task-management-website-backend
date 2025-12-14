// src/controllers/taskController.js
const prisma = require('../utils/prisma');

// 1. Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId }, 
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error); // <--- Add this!
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Check if user exists first (Debug step)
    console.log("Creating task for User ID:", req.user.userId);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        checkInDate,
        bedType, isSmoking, hasConnecting, hasBreakfast,
        userId: req.user.userId 
      }
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error); // <--- Add this!
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Delete a Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params; 
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.task.delete({ where: { id: Number(id) } });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error); // <--- Add this!
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Update a Task (Title, Description, Status, or Due Date)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    // 1. Check if the task exists and belongs to the user
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to edit this task" });
    }

    // 2. Update the task
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        dueDate,
        checkInDate
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};