const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
require('dotenv').config();

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for testing

// Routes
app.use('/api/auth', authRoutes);

// Start server (listen on all network interfaces)
app.listen(process.env.PORT || 3000, '122.161.76.148', () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

