const db = require('../config/db');

const Employee = {
  // Get all employees
  getAll: (callback) => {
    db.query('SELECT * FROM employee', callback);
  },

  // Get employee by ID
  getById: (id, callback) => {
    db.query('SELECT * FROM employee WHERE Employee_Id = ?', [id], callback);
  },

  // Create employee
  create: (employeeData, callback) => {
    if (!employeeData) return callback(new Error("Employee data undefined"), null);

    const { First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path } = employeeData;

    db.query(
      `INSERT INTO employee 
      (First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path],
      callback
    );
  },

  // Update employee
  update: (id, employeeData, callback) => {
    const { First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path } = employeeData;

    db.query(
      `UPDATE employee 
       SET First_Name=?, Last_Name=?, Email=?, Phone=?, Address=?, Join_Date=?, Designation=?, Basic_Salary=?, Department_Id=?, Image_Path=? 
       WHERE Employee_Id=?`,
      [First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path, id],
      callback
    );
  },

  // Delete employee safely
  delete: (id, callback) => {
    db.query('DELETE FROM employee WHERE Employee_Id = ?', [id], (err, result) => {
      if (err) {
        // Check for foreign key constraint
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          return callback(new Error("Cannot delete employee: This employee has related records. Delete those first."), null);
        }
        return callback(err, null);
      }
      callback(null, result);
    });
  }
};

module.exports = Employee;
