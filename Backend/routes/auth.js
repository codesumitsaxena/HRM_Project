const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Signup (Employee default)
router.post('/signup', async (req, res) => {
  const { Full_Name, Email, Password } = req.body;
  if (!Full_Name || !Email || !Password)
    return res.status(400).json({ msg: 'All fields required' });

  const hashedPassword = await bcrypt.hash(Password, 10);
  const Role = 'employee'; // default role

  db.query(
    'INSERT INTO users (Full_Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
    [Full_Name, Email, hashedPassword, Role],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ msg: 'Email already exists' });
        return res.status(500).json({ msg: err.message });
      }
      res.json({ msg: 'Signup successful' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { Email, Password } = req.body;

  db.query('SELECT * FROM users WHERE Email = ?', [Email], async (err, result) => {
    if (err) return res.status(500).json({ msg: err.message });
    if (result.length === 0) return res.status(400).json({ msg: 'User not found' });

    const user = result[0];
    const validPassword = await bcrypt.compare(Password, user.Password);
    if (!validPassword) return res.status(400).json({ msg: 'Incorrect password' });

    const token = jwt.sign({ User_Id: user.User_Id, Role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.Role, name: user.Full_Name });
  });
});

module.exports = router;
