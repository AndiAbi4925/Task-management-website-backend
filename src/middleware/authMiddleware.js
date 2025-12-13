// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get the token from the header (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  // The header looks like "Bearer eyJhbGci...", so we split it to get just the token
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token
    // (If it's fake or expired, this will crash to the catch block)
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');

    // 3. Attach the User ID to the request
    // Now the next function knows EXACTLY who is logged in
    req.user = decoded; 

    next(); // Move to the next step (the Controller)

  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};