const db = require('../config/db');  // Import connection pool

const HRLeaveRequest = {
  // Get all leave requests
  getAll: (callback) => {
    db.query('SELECT * FROM hr_leave_request', (err, rows) => {
      if (err) {
        return callback(err, null);  // Pass error to callback
      }
      callback(null, rows);  // Pass results to callback
    });
  },

  // Get leave request by ID
  getById: (id, callback) => {
    db.query('SELECT * FROM hr_leave_request WHERE Leave_Id = ?', [id], (err, rows) => {
      if (err) {
        return callback(err, null);  // Pass error to callback
      }
      callback(null, rows);  // Pass results to callback
    });
  },

  // Create a new leave request
  create: (data, callback) => {
    const { Employee_Id, Start_Date, End_Date, Reason, Leave_Type } = data;
    db.query(
      `INSERT INTO hr_leave_request 
       (Employee_Id, Start_Date, End_Date, Reason, Leave_Type) 
       VALUES (?, ?, ?, ?, ?)`,
      [Employee_Id, Start_Date, End_Date, Reason, Leave_Type],
      (err, result) => {
        if (err) {
          return callback(err, null);  // Pass error to callback
        }
        callback(null, result.insertId);  // Pass insertId to callback
      }
    );
  },

  // Update leave request status
  updateStatus: (id, status, comments, approvedBy, callback) => {
    db.query(
      `UPDATE hr_leave_request 
       SET Status = ?, Comments = ?, Approved_By = ?, Approved_Date = CURDATE() 
       WHERE Leave_Id = ?`,
      [status, comments, approvedBy, id],
      (err, result) => {
        if (err) {
          return callback(err, null);  // Pass error to callback
        }
        callback(null, result);  // Pass result to callback
      }
    );
  },

  // Delete a leave request
  delete: (id, callback) => {
    db.query('DELETE FROM hr_leave_request WHERE Leave_Id = ?', [id], (err, result) => {
      if (err) {
        return callback(err, null);  // Pass error to callback
      }
      callback(null, result);  // Pass result to callback
    });
  }
};

module.exports = HRLeaveRequest;
