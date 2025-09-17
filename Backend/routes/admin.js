const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken, authorize } = require('../middleware/auth');

// Admin creates HR/Manager/Admin
router.post('/create-user', authenticateToken, authorize(['admin']), async (req, res) => {
  const { Full_Name, Email, Password, Role } = req.body;
  if (!Full_Name || !Email || !Password || !Role) return res.status(400).json({ msg: 'All fields required' });

  const hashedPassword = await bcrypt.hash(Password, 10);

  db.query(
    'INSERT INTO users (Full_Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
    [Full_Name, Email, hashedPassword, Role],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ msg: 'Email already exists' });
        return res.status(500).json({ msg: err.message });
      }
      res.json({ msg: `${Role} created successfully` });
    }
  );
});

// Example protected route
router.get('/dashboard', authenticateToken, authorize(['admin']), (req, res) => {
  res.json({ msg: 'Welcome Admin!' });
});

module.exports = router;
