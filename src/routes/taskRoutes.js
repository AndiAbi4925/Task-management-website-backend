const express = require('express');
const router = express.Router(); // <--- Only declare this ONCE!
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Define your routes
router.get('/', authMiddleware, taskController.getTasks);
router.post('/', authMiddleware, taskController.createTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;