const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../Model/UserModel');

exports.register = async (req, res) => {
  console.log("REQ.BODY: ", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length > 0)
      return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    createUser(name, email, hashedPassword, (err, result) => {
      if (err) return res.status(500).json({ message: "Registration failed" });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token - IMPORTANT: Use consistent field names with middleware
    const token = jwt.sign(
      { 
        User_Id: user.id, // Match with middleware expectation
        userId: user.id,
        employeeId: user.Employee_Id || user.id,
        name: user.name,
        email: user.email,
        Role: user.role || 'employee', // Match with middleware expectation
        role: user.role || 'employee'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response matching frontend AuthContext expectations
    res.json({ 
      success: true,
      message: "Login successful", 
      token,
      role: user.role || 'employee',
      name: user.name,
      userId: user.Employee_Id || user.id, // This will be used in React
      employeeId: user.Employee_Id || user.id,
      email: user.email
    });
  });
};

// Profile endpoint
exports.getProfile = (req, res) => {
  const user = req.user;
  
  res.json({
    success: true,
    user: {
      id: user.userId || user.User_Id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role || user.Role
    }
  });
};