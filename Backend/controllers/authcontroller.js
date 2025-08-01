const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password)
    return res.status(400).json({ message: "User ID and password are required." });

  const hashedPassword = bcrypt.hashSync(password, 8);
  const sql = "INSERT INTO users (user_id, password) VALUES (?, ?)";

  db.query(sql, [user_id, hashedPassword], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "User already exists." });
      }
      return res.status(500).json({ message: "Signup failed." });
    }
    res.status(201).json({ message: "User registered successfully." });
  });
};

exports.login = (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password)
    return res.status(400).json({ message: "User ID and password are required." });

  const sql = "SELECT * FROM users WHERE user_id = ?";
  db.query(sql, [user_id], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      message: "Login successful",
      token,
      user_id: user.user_id
    });
  });
};
