// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// PROTECTED ROUTES (Notice the 'authMiddleware' added in the middle)

// GET /api/tasks -> Get my tasks
router.get('/', authMiddleware, taskController.getTasks);

// POST /api/tasks -> Create a task
router.post('/', authMiddleware, taskController.createTask);

module.exports = router;