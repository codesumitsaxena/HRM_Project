const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/LeaveRequestController');
const { authenticateToken, authorize } = require("../middleware/authMiddleware");

router.post('/', authenticateToken, authorize(['employee']), leaveController.createLeave);
router.get('/', authenticateToken, authorize(['admin', 'hr']), leaveController.getLeaves);
router.get('/:id', authenticateToken, authorize(['admin', 'hr', 'employee']), leaveController.getLeaveById);
router.put('/:id', authenticateToken, authorize(['admin', 'hr']), leaveController.updateLeave);
router.delete('/:id', authenticateToken, authorize(['admin']), leaveController.deleteLeave);

module.exports = router;
