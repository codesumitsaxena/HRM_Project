const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/Departmentcontroller'); // This must match file path exactly

router.post('/', departmentController.addDepartment);
router.get('/', departmentController.getAllDepartments);


module.exports = router;