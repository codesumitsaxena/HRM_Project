const db = require('../config/db');

const Leave = {
  getAll: (callback) => {
    db.query('SELECT * FROM leave_request', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM leave_request WHERE Leave_Id = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO leave_request SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE leave_request SET ? WHERE Leave_Id = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM leave_request WHERE Leave_Id = ?', [id], callback);
  }
};

module.exports = Leave;
