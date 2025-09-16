const db = require('../config/db');

// ✅ GET all employees with pagination
exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Build search condition
    let searchCondition = '';
    let queryParams = [];

    if (search) {
      searchCondition = 'WHERE CONCAT(First_Name, " ", Last_Name) LIKE ?';
      queryParams.push(`%${search}%`);
    }

    // Get total count for pagination info
    const countQuery = `SELECT COUNT(*) as total FROM Employee ${searchCondition}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const dataQuery = `SELECT * FROM Employee ${searchCondition} LIMIT ? OFFSET ?`;
    const dataParams = [...queryParams, limit, offset];
    const [rows] = await db.query(dataQuery, dataParams);

    // Return data with pagination info
    res.json({
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (err) {
    console.error("DB ERROR in getAllEmployees:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ GET employee by ID (with Department Name)
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT e.*, d.Department_Name 
       FROM Employee e
       LEFT JOIN Departments d ON e.Department_Id = d.Dept_Id
       WHERE e.Employee_Id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]); // ✅ includes Department_Name
  } catch (err) {
    console.error("DB ERROR in getEmployeeById:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ POST create employee
exports.createEmployee = async (req, res) => {
  console.log("Received Employee Data:", req.body);
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
    return res.status(400).json({ message: "Required fields missing" });
  }

  const query = `
    INSERT INTO Employee
    (First_Name, Last_Name, Email, Phone, Address, Join_Date, Designation, Basic_Salary, Department_Id, Image_Path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
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
    ]);
    res.status(201).json({ message: "Employee created successfully", employeeId: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ PUT update employee - CORRECTED TO PREVENT FOREIGN KEY ERROR
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    First_Name,
    Last_Name,
    Email,
    Phone,
    Address,
    Join_Date,
    Designation,
    Basic_Salary,
    Department_Id, // Now explicitly handling this field
    Image_Path,
  } = req.body;

  try {
    // This is the key change. We explicitly list each field
    // and convert the data to the correct type for the database.
    const query = `
      UPDATE Employee
      SET
        First_Name = ?,
        Last_Name = ?,
        Email = ?,
        Phone = ?,
        Address = ?,
        Join_Date = ?,
        Designation = ?,
        Basic_Salary = ?,
        Department_Id = ?,
        Image_Path = ?
      WHERE Employee_Id = ?
    `;

    const values = [
      First_Name,
      Last_Name,
      Email,
      Phone,
      Address,
      Join_Date,
      Designation,
      parseFloat(Basic_Salary), // Ensure Basic_Salary is a number
      parseInt(Department_Id, 10), // Ensure Department_Id is an integer
      Image_Path,
      id,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.json({ message: "Employee updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database error." });
  }
};

// ✅ DELETE employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM Employee WHERE Employee_Id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Database error" });
  }
};