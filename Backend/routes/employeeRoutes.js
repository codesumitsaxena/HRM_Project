const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');
const { authenticateToken, authorize } = require("../middleware/authMiddleware");

router.post('/', authenticateToken, authorize(['admin']), ctrl.createEmployee);
router.get('/', authenticateToken, authorize(['admin', 'hr']), ctrl.getEmployees);
router.get('/:id', authenticateToken, authorize(['admin', 'hr', 'employee']), ctrl.getEmployeeById);
router.put('/:id', authenticateToken, authorize(['admin', 'hr']), ctrl.updateEmployee);
router.delete('/:id', authenticateToken, authorize(['admin']), ctrl.deleteEmployee);

module.exports = router;
