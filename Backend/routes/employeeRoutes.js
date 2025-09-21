const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');

router.post('/', ctrl.createEmployee);
router.get('/', ctrl.getEmployees);
router.get('/:id', ctrl.getEmployeeById);
router.put('/:id', ctrl.updateEmployee);
router.delete('/:id', ctrl.deleteEmployee);

module.exports = router;
