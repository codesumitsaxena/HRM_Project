const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Signup
exports.signup = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
    [full_name, email, hashedPassword],
    (err) => {
      if (err) {
        console.error("Signup DB Error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Signup successful" });
    }
  );
};

// ✅ Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });
  });
};

// ✅ Get all users
exports.getAllUsers = (req, res) => {
  const query = "SELECT id, full_name, email, created_at FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Get Users DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};

// ✅ Get user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, full_name, email, created_at FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Get User by ID DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json(results[0]);
    }
  );
};
