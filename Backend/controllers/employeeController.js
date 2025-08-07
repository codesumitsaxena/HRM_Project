const db = require('../config/db');

exports.getEmployees = (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



exports.addEmployee = (req, res) => {
  const { first_name, last_name, employee_id, phone, join_date, role, email } = req.body;
  const sql = 'INSERT INTO employees (first_name, last_name, employee_id, phone, join_date, role, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [first_name, last_name, employee_id, phone, join_date, role, email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Duplicate employee_id' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Employee added', id: result.insertId });
  });
};

exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, employee_id, phone, join_date, role, email } = req.body;

  console.log("UPDATE CALLED");
  console.log("ID:", id);
  console.log("BODY:", req.body);

  const sql = 'UPDATE employees SET first_name=?, last_name=?, employee_id=?, phone=?, join_date=?, role=?, email=? WHERE id=?';
  db.query(sql, [first_name, last_name, employee_id, phone, join_date, role, email, id], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err);  // <-- ADD THIS
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Duplicate employee_id' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Employee updated successfully' });
  });
};

exports.deleteEmployee = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee deleted successfully' });
  });
};
