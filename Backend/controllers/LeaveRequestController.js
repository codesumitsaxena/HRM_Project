const Leave = require('../Model/LeaveRequestModel');

// Get all leaves
exports.getLeaves = (req, res) => {
  Leave.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get leave by ID
exports.getLeaveById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  Leave.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results[0]) return res.status(404).json({ message: 'Leave not found' });
    res.json(results[0]);
  });
};

// Create new leave
exports.createLeave = (req, res) => {
  const data = req.body;
  Leave.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    Leave.getById(result.insertId, (err, newLeave) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(newLeave[0]);
    });
  });
};

// Update leave
exports.updateLeave = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = req.body;

  Leave.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Leave not found' });

    // Return the updated leave object
    Leave.getById(id, (err, updatedLeave) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(updatedLeave[0]);
    });
  });
};


// Delete leave
exports.deleteLeave = (req, res) => {
  const id = parseInt(req.params.id, 10);
  Leave.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Leave not found' });
    res.json({ message: 'Leave deleted successfully' });
  });
};
