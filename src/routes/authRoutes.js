// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When someone POSTs to /register, run the register function
router.post('/register', authController.register);

// When someone POSTs to /login, run the login function
router.post('/login', authController.login);

module.exports = router;