const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendenceController"); // 👈 yaha dikkat

const { authenticateToken, authorize } = require('../middleware/authMiddleware');

router.get("/", authenticateToken, authorize(['admin', 'hr', 'manager']), attendanceController.getAllAttendance);
router.get("/:id", authenticateToken, authorize(['admin', 'hr', 'manager', 'employee']), attendanceController.getAttendanceById);
router.post("/", authenticateToken, authorize(['admin', 'hr']), attendanceController.createAttendance);
router.put("/:id", authenticateToken, authorize(['admin', 'hr']), attendanceController.updateAttendance);
router.delete("/:id", authenticateToken, authorize(['admin']), attendanceController.deleteAttendance);

module.exports = router;
