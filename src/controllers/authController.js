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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { userId: user.id },
      'YOUR_SECRET_KEY', // We will move this to .env later
      { expiresIn: '1h' }
    );

    // 4. Send Success
    res.json({
      message: "Login successful",
      token: token,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};