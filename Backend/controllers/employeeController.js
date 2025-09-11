const Employee = require('../Model/employeeModel');

// ✅ Get all employees
exports.getEmployees = (req, res) => {
  Employee.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get employee by ID
exports.getEmployeeById = (req, res) => {
  Employee.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results[0]);
  });
};

// ✅ Add employee
exports.addEmployee = (req, res) => {
  Employee.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee added', id: result.insertId });
  });
};

// ✅ Update employee
exports.updateEmployee = (req, res) => {
  Employee.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee updated' });
  });
};

// ✅ Delete employee
exports.deleteEmployee = (req, res) => {
  Employee.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '❌ Employee deleted' });
  });
};
