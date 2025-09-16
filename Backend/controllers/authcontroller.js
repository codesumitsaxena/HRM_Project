const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// ================== REGISTER ==================
exports.register = async (req, res) => {
  try {
    const { Full_Name, Email, Password, ConfirmPassword } = req.body;

    // 1. Check required fields
    if (!Full_Name || !Email || !Password || !ConfirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check passwords match
    if (Password !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3. Check if email already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE Email = ?", [Email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // 5. Insert into DB
    await db.query(
      "INSERT INTO users (Full_Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
      [Full_Name, Email, hashedPassword, "user"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================== LOGIN ==================
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user by email
    const [users] = await db.query("SELECT * FROM users WHERE Email = ?", [Email]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user.User_Id, email: user.Email, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.User_Id,
        name: user.Full_Name,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};