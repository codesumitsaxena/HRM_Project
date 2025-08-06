const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/department');
const employeeRoutes = require('./routes/employeeRoutes');
=======
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
require('dotenv').config();
>>>>>>> ef8af0fda68bec7e1b114289463c4f796226fcef

dotenv.config();
const app = express();
<<<<<<< HEAD
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ HRM Backend is running');
});

// All APIs
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/Employee', employeeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
=======

app.use(express.json());  // Only once
app.use(cors());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
>>>>>>> ef8af0fda68bec7e1b114289463c4f796226fcef
