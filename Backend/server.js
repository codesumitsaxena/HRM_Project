const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const leaveRoutes = require('./routes/LeaveRoutes');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// ✅ Use employee routes
app.use('/api/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use("/leaves", leaveRoutes);


// ✅ Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
