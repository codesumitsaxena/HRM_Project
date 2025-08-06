const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../Model/UserModel');

exports.register = async (req, res) => {
  console.log("REQ.BODY: ", req.body); // 👈 add this line
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
    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: results[0].id, name: results[0].name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: "Login successful", token });
  });
};
