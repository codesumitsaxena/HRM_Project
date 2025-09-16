const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/Departmentcontroller");
const authenticate = require("../middleware/authMiddleware"); // import middleware

// Protected routes
router.post("/", authenticate, departmentController.addDepartment);
router.get("/", authenticate, departmentController.getAllDepartments);
router.get("/:id", authenticate, departmentController.getDepartmentById);
router.put("/:id", authenticate, departmentController.updateDepartment);
router.delete("/:id", authenticate, departmentController.deleteDepartment);

module.exports = router;
