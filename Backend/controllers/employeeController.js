const Employee = require('../Model/employeeModel');

// Helper to format date safely
function formatDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  // If input is DD-MM-YYYY
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  // Already in YYYY-MM-DD
  return dateStr;
}

// Get all employees
exports.getEmployees = (req, res) => {
  Employee.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get employee by ID
exports.getEmployeeById = (req, res) => {
  Employee.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results[0]);
  });
};

// Add employee
exports.addEmployee = (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Request body empty.' });

  // Fix Join_Date format before sending to model
  if (req.body.Join_Date) {
    req.body.Join_Date = formatDate(req.body.Join_Date);
  }

  Employee.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee added', id: result.insertId });
  });
};

// Update employee
exports.updateEmployee = (req, res) => {
  if (req.body.Join_Date) {
    req.body.Join_Date = formatDate(req.body.Join_Date);
  }

  Employee.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee updated' });
  });
};

// Delete employee
exports.deleteEmployee = (req, res) => {
  Employee.delete(req.params.id, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: 'Employee deleted successfully' });
  });
};
