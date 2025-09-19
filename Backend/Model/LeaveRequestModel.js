const db = require('../config/db');

const Leave = {
  // Get all leaves
  getAll: (callback) => {
    db.query('SELECT * FROM leave_request', callback);
  },

  // Get leave by ID
  getById: (id, callback) => {
    db.query('SELECT * FROM leave_request WHERE Leave_Id = ?', [id], callback);
  },

  // Create new leave
  create: (data, callback) => {
    db.query('INSERT INTO leave_request SET ?', data, callback);
  },

  // Update leave by ID
  update: (id, data, callback) => {
    db.query('UPDATE leave_request SET ? WHERE Leave_Id = ?', [data, id], callback);
  },
  

  // Delete leave by ID
  delete: (id, callback) => {
    db.query('DELETE FROM leave_request WHERE Leave_Id = ?', [id], callback);
  },
};

module.exports = Leave;
