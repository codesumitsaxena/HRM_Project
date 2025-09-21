const db = require('../config/db');
const allowedFields = require('../Model/employeeModel');

// Helper to build update query
function buildUpdateQuery(body) {
  const keys = Object.keys(body).filter(k => allowedFields.includes(k));
  if (!keys.length) return null;
  const sets = keys.map(k => `\`${k}\`=?`).join(', ');
  const values = keys.map(k => body[k]);
  return { sets, values };
}

// CREATE Employee
exports.createEmployee = (req, res) => {
  const data = req.body;
  const keys = Object.keys(data).filter(k => allowedFields.includes(k));
  if (!keys.length) return res.status(400).json({ error: 'No valid fields' });

  const cols = keys.map(k => `\`${k}\``).join(',');
  const placeholders = keys.map(_ => '?').join(',');
  const values = keys.map(k => data[k]);

  const sql = `INSERT INTO Employees (${cols}) VALUES (${placeholders})`;
  db.query(sql, values, (err, result) => {
    if (err) return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ error: err.message });
    db.query('SELECT * FROM Employees WHERE Employee_Id=?', [result.insertId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(rows[0]);
    });
  });
};

// GET all Employees
exports.getEmployees = (req, res) => {
  const { search, limit = 50, offset = 0 } = req.query;
  let sql = 'SELECT * FROM Employees';
  const params = [];

  if (search) {
    sql += ' WHERE First_Name LIKE ? OR Last_Name LIKE ? OR Email LIKE ?';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  sql += ' ORDER BY Employee_Id DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// GET Employee by ID
exports.getEmployeeById = (req, res) => {
  db.query('SELECT * FROM Employees WHERE Employee_Id=?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  });
};

// UPDATE Employee
exports.updateEmployee = (req, res) => {
  const upd = buildUpdateQuery(req.body);
  if (!upd) return res.status(400).json({ error: 'No valid fields to update' });

  const sql = `UPDATE Employees SET ${upd.sets} WHERE Employee_Id=?`;
  const params = [...upd.values, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Employee not found' });

    db.query('SELECT * FROM Employees WHERE Employee_Id=?', [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows[0]);
    });
  });
};

// DELETE Employee
exports.deleteEmployee = (req, res) => {
  db.query('DELETE FROM Employees WHERE Employee_Id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  });
};
