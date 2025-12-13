// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// 1. The Register Function
exports.register = async (req, res) => {
  try {
    // A. Get data from the user (Postman/Frontend sends this)
    const { name, email, password } = req.body;

    // B. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already taken" });
    }

    // C. Hash the password (Security Step!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // D. Save to Database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    });

    // E. Send success message
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 2. The Login Function (We will use this later)
exports.login = async (req, res) => {
    // Placeholder for now
    res.json({ message: "Login logic goes here" });
};