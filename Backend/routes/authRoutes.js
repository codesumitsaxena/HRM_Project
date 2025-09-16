const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");

// Auth routes
router.post("/register", authController.register);  // Signup
router.post("/login", authController.login);        // Login

// ✅ Optional: verify token endpoint (useful for frontend auto-login checks)
const authenticate = require("../middleware/authMiddleware");
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user }); // req.user comes from decoded JWT
});

module.exports = router;