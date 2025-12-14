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
    console.log("--- DEBUG: STARTING CREATE TASK ---");
    console.log("1. User ID from Token:", req.user.userId);
    console.log("2. Data received from Frontend:", req.body);

    const { title, description, dueDate, checkInDate, bedType, isSmoking, hasConnecting, hasBreakfast } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        checkInDate,
        bedType,
        isSmoking,
        hasConnecting,
        hasBreakfast,
        userId: req.user.userId 
      }
    });

    console.log("3. SUCCESS! Task created:", newTask);
    res.status(201).json(newTask);

  } catch (error) {
    console.error("!!! ERROR CREATING TASK !!!", error); // <--- This prints the real error
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
    
    // 1. Get the new data from the website
    const { 
        title, description, status, 
        dueDate, checkInDate, 
        bedType, isSmoking, hasConnecting, hasBreakfast 
    } = req.body;

    // 2. Check if the task exists and belongs to the user
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized to edit this task" });
    }

    // 3. Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        // Update the Date Fields
        dueDate,
        checkInDate,
        // Update the Room Details
        bedType,
        isSmoking,
        hasConnecting,
        hasBreakfast
      }
    });

    console.log("Success! Task Updated.");
    res.json(updatedTask);

  } catch (error) {
    console.error("!!! ERROR UPDATING TASK !!!", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};