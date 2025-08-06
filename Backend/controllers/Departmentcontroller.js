const db = require('../config/db');

// ✅ POST: Add department
exports.addDepartment = (req, res) => {
  const { Department_Name, Department_Head, Total_Employee } = req.body;

  if (!Department_Name || !Department_Head) {
    return res.status(400).json({ message: 'Department_Name and Department_Head are required' });
  }

  const query = `
    INSERT INTO departments (Department_Name, Department_Head, Total_Employee)
    VALUES (?, ?, ?)
  `;
  db.query(query, [Department_Name, Department_Head, Total_Employee || null], (err) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Department added successfully' });
  });
};

// ✅ GET: All departments remains same
exports.getAllDepartments = (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};