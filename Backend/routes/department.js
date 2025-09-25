const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/Departmentcontroller');
const { authenticateToken, authorize } = require("../middleware/authMiddleware");

router.post('/', authenticateToken, authorize(['admin']), departmentController.addDepartment);
router.get('/', authenticateToken, authorize(['admin', 'hr']), departmentController.getAllDepartments);
router.get('/:id', authenticateToken, authorize(['admin', 'hr']), departmentController.getDepartmentById);
router.put("/:id", authenticateToken, authorize(['admin']), departmentController.updateDepartment);
router.delete('/:id', authenticateToken, authorize(['admin']), departmentController.deleteDepartment);

module.exports = router;
