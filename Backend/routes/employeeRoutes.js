const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authenticate = require("../middleware/authMiddleware"); // import middleware

// Protected routes
router.get("/", authenticate, employeeController.getAllEmployees);
router.get("/:id", authenticate, employeeController.getEmployeeById);
router.post("/", authenticate, employeeController.createEmployee);
router.put("/:id", authenticate, employeeController.updateEmployee);
router.delete("/:id", authenticate, employeeController.deleteEmployee);

module.exports = router;