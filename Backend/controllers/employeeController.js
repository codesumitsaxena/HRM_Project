const db = require('../config/db');

// GET all employees
exports.getAllEmployees = (req, res) => {
  const query = 'SELECT * FROM Employee';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching Employees:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// GET employee by ID
exports.getEmployeeById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Employee WHERE Employee_Id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(results[0]);
  });
};

// POST create employee
exports.createEmployee = (req, res) => {
  const {
    First_Name,
    Last_Name,
    Email,
    Phone,
    Address,
    Join_Date,
    Designation,
    Basic_Salary,
    Department_Id,
    Image_Path,
  } = req.body;

  if (!First_Name || !Email || !Department_Id) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const query = `
    INSERT INTO Employee 
    (First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    First_Name, Last_Name, Email, Phone, Address,
    Join_Date, Designation, Basic_Salary, Department_Id, Image_Path
  ], (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Employee created successfully' });
  });
};

// PUT update employee
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  db.query('UPDATE Employee SET ? WHERE Employee_Id = ?', [updatedData, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ message: 'Employee updated successfully' });
  });
};

// DELETE employee
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Employee WHERE Employee_Id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
};