// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

// 2. Initialize Express
const app = express();

// 3. Middlewares
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Allow server to read JSON data from body

// 4. Test Route (To check if server works)
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Task Manager API",
    status: "Running",
    timestamp: new Date()
  });
});

// 5. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});