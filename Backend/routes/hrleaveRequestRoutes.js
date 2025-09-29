const express = require('express');
const router = express.Router();
const hrController = require('../controllers/HRLeaveRequestController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// CRUD routes
router.post('/', authenticateToken, authorize(['employee','hr']), hrController.createLeave);
router.get('/', authenticateToken, authorize(['admin','hr','employee']), hrController.getAllLeaves);
router.get('/:id', authenticateToken, authorize(['admin','hr','employee']), hrController.getLeaveById);
router.put('/:id/status', authenticateToken, authorize(['admin','hr']), hrController.updateLeaveStatus);
router.delete('/:id', authenticateToken, authorize(['admin']), hrController.deleteLeave);

module.exports = router;
