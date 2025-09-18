const db = require('../config/db');
// ✅ POST: Add Department
exports.addDepartment = async (req, res) => {
  const { Department_Name, Department_Head, Total_Employee } = req.body;

  if (!Department_Name || !Department_Head) {
    return res.status(400).json({ message: 'Department_Name and Department_Head are required' });
  }

  const query =
    "INSERT INTO departments (Department_Name, Department_Head, Total_Employee) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(query, [
      Department_Name,
      Department_Head,
      Total_Employee || 0, // default to 0 if not provided
    ]);

    res
      .status(201)
      .json({ message: 'Department added successfully', departmentId: result.insertId });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ message: 'Database error' });
  }
};

// ✅ GET: Fetch All Departments with pagination
exports.getAllDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Build search condition
    let searchCondition = '';
    let queryParams = [];
    
    if (search) {
      searchCondition = 'WHERE Department_Name LIKE ? OR Department_Head LIKE ?';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count for pagination info
    const countQuery = `SELECT COUNT(*) as total FROM departments ${searchCondition}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const dataQuery = `SELECT * FROM departments ${searchCondition} ORDER BY Dept_Id DESC LIMIT ? OFFSET ?`;
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
    console.error("DB ERROR in getAllDepartments:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET: Fetch Department by ID
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM departments WHERE Dept_Id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("DB ERROR in getDepartmentById:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ PUT: Update Department
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { Department_Name, Department_Head } = req.body;

  if (!Department_Name || !Department_Head) {
    return res.status(400).json({ message: 'Department_Name and Department_Head are required' });
  }

  const query = `UPDATE departments SET Department_Name = ?, Department_Head = ? WHERE Dept_Id = ?`;

  try {
    const [result] = await db.query(query, [Department_Name, Department_Head, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department updated successfully' });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: 'Database error' });
  }
};

// ✅ DELETE: Remove Department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM departments WHERE Dept_Id = ?";

  try {
    const [result] = await db.query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: 'Database error' });
  }
};