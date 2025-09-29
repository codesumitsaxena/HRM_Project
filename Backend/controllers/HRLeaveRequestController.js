const HRLeaveRequest = require('../Model/HRLeaveRequest');

// Get all leave requests
exports.getAllLeaves = (req, res) => {
  HRLeaveRequest.getAll((err, leaves) => {
    if (err) {
      return res.status(500).json({ error: err.message });  // Pass error to response
    }
    res.json(leaves);  // Return the leave requests
  });
};

// Get leave request by ID
exports.getLeaveById = (req, res) => {
  const id = parseInt(req.params.id);
  HRLeaveRequest.getById(id, (err, leaves) => {
    if (err) {
      return res.status(500).json({ error: err.message });  // Pass error to response
    }
    if (!leaves[0]) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json(leaves[0]);  // Return the leave details
  });
};

// Create a new leave request
exports.createLeave = (req, res) => {
  HRLeaveRequest.create(req.body, (err, insertId) => {
    if (err) {
      return res.status(500).json({ error: err.message });  // Pass error to response
    }
    HRLeaveRequest.getById(insertId, (err, leave) => {
      if (err) {
        return res.status(500).json({ error: err.message });  // Pass error to response
      }
      res.status(201).json(leave[0]);  // Return the created leave request
    });
  });
};

// Update leave status
exports.updateLeaveStatus = (req, res) => {
  const id = parseInt(req.params.id);
  const { status, comments } = req.body;
  const approvedBy = req.user?.Employee_Id || null;

  HRLeaveRequest.updateStatus(id, status, comments, approvedBy, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });  // Pass error to response
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json({ message: 'Leave status updated successfully' });  // Success message
  });
};

// Delete a leave request
exports.deleteLeave = (req, res) => {
  const id = parseInt(req.params.id);
  HRLeaveRequest.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });  // Pass error to response
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json({ message: 'Leave deleted successfully' });  // Success message
  });
};
