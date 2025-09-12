const Leave = require('../Model/LeaveRequestModel');  // 👉 yaha import karo

// Get all leaves
exports.getLeaves = (req, res) => {
  Leave.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get leave by ID
exports.getLeaveById = (req, res) => {
  const id = req.params.id;
  Leave.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

// Create new leave
exports.createLeave = (req, res) => {
  const data = req.body;
  Leave.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Leave created successfully', id: result.insertId });
  });
};

// Update leave
exports.updateLeave = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Leave.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Leave updated successfully' });
  });
};

// Delete leave
exports.deleteLeave = (req, res) => {
  const id = req.params.id;
  Leave.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Leave deleted successfully' });
  });
};
