const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes')
require('dotenv').config();

dotenv.config();
const app = express();

app.use(express.json());  // Only once
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);



app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
