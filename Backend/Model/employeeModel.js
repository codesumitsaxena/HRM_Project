const db = require('../config/db');

exports.getAllEmployees = (callback) => {
  const query = 'SELECT * FROM employees';
  db.query(query, callback);
};

exports.createEmployee = (data, callback) => {
  const query = `
    INSERT INTO employees 
    (first_name, last_name, employee_id, phone, join_date, role, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.first_name,
    data.last_name,
    data.employee_id,
    data.phone,
    data.join_date,
    data.role,
    data.email
  ];
  db.query(query, values, callback);
};

exports.updateEmployee = (id, data, callback) => {
  const query = `
    UPDATE employees SET 
      first_name = ?, 
      last_name = ?, 
      employee_id = ?, 
      phone = ?, 
      join_date = ?, 
      role = ?, 
      email = ? 
    WHERE id = ?
  `;
  const values = [
    data.first_name,
    data.last_name,
    data.employee_id,
    data.phone,
    data.join_date,
    data.role,
    data.email,
    id
  ];
  db.query(query, values, callback);
};

exports.deleteEmployee = (id, callback) => {
  const query = 'DELETE FROM employees WHERE id = ?';
  db.query(query, [id], callback);
};
