const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveRequestController");
const authenticate = require("../middleware/authMiddleware");

// Protected routes
router.post("/", authenticate, leaveController.createLeaveRequest);
router.get("/", authenticate, leaveController.getAllLeaveRequests);
router.get("/:id", authenticate, leaveController.getLeaveRequestById);

// 🛠️ NEW: Route for updating leave details (type, dates, reason)
router.put("/:id", authenticate, leaveController.updateLeaveRequest);

// 🛠️ UPDATED: Route for updating only leave status
router.put("/status/:id", authenticate, leaveController.updateLeaveStatus);

router.delete("/:id", authenticate, leaveController.deleteLeaveRequest);

module.exports = router;