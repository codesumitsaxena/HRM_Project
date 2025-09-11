const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// ✅ Routes
router.get('/', employeeController.getEmployees);       // Get all
router.get('/:id', employeeController.getEmployeeById); // Get by ID
router.post('/', employeeController.addEmployee);       // Create
router.put('/:id', employeeController.updateEmployee);  // Update
router.delete('/:id', employeeController.deleteEmployee); // Delete

module.exports = router;
