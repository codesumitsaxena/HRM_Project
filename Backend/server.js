// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/LeaveRoutes');
const departmentRoutes = require('./routes/department');
const attendanceRoutes = require("./routes/attendenceRoutes");
const hrLeaveRoutes = require('./routes/hrleaveRequestRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes); // Auth routes (signup/login/profile)
app.use('/employees', employeeRoutes);
app.use('/leaves', leaveRoutes);
app.use('/departments', departmentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/hr-leaves', hrLeaveRoutes);


// Test route
app.get('/', (req, res) => {
    res.send('🚀 HRM Backend Running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});