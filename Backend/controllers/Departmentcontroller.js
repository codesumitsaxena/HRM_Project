const db = require('../config/db');

// ✅ POST: Add department (with duplicate check)
exports.addDepartment = (req, res) => {
  const { Department_Name, Department_Head, Total_Employee } = req.body;

  if (!Department_Name || !Department_Head) {
    return res.status(400).json({ message: 'Department_Name and Department_Head are required' });
  }

  // Check if department already exists
  const checkQuery = "SELECT * FROM departments WHERE Department_Name = ?";
  db.query(checkQuery, [Department_Name], (err, results) => {
    if (err) {
      console.error("Check Error:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Insert if not duplicate
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
  });
};

// ✅ GET: All departments
exports.getAllDepartments = (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// ✅ GET: Department by ID
exports.getDepartmentById = (req, res) => {
  const deptId = req.params.id;

  db.query("SELECT * FROM departments WHERE Dept_Id = ?", [deptId], (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(results[0]);
  });
};

// ✅ PUT: Update department by ID
exports.updateDepartment = (req, res) => {
  const deptId = req.params.id;   // ✅ from URL
  const { Department_Name, Department_Head, Total_Employee } = req.body;

  const query = `
    UPDATE departments 
    SET Department_Name = ?, Department_Head = ?, Total_Employee = ? 
    WHERE Dept_Id = ?
  `;
  db.query(query, [Department_Name, Department_Head, Total_Employee || null, deptId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department updated successfully" });
  });
};


// ✅ DELETE: Delete department by ID
exports.deleteDepartment = (req, res) => {
  const deptId = req.params.id;

  const query = "DELETE FROM departments WHERE Dept_Id = ?";
  db.query(query, [deptId], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);

      // Foreign key error handling
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'Cannot delete department because employees are assigned to it' });
      }

      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  });
};
