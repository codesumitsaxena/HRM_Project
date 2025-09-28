const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');
const { authenticateToken, authorize, checkEmployeeAccess } = require("../middleware/authMiddleware");

router.post('/', authenticateToken, authorize(['admin']), ctrl.createEmployee);
router.get('/', authenticateToken, authorize(['admin', 'hr']), ctrl.getEmployees);

// Updated routes with checkEmployeeAccess middleware
router.get('/:id', authenticateToken, authorize(['admin', 'hr', 'employee']), checkEmployeeAccess, ctrl.getEmployeeById);
router.put('/:id', authenticateToken, authorize(['admin', 'hr', 'employee']), checkEmployeeAccess, ctrl.updateEmployee);

router.delete('/:id', authenticateToken, authorize(['admin']), ctrl.deleteEmployee);

module.exports = router;