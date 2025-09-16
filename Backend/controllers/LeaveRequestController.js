const db = require('../config/db');

// ✅ POST: Create Leave Request
exports.createLeaveRequest = async (req, res) => {
  const { Employee_Id, First_Name, Last_Name, Leave_Type, Start_Date, End_Date, Reason } = req.body;

  // Validation
  if (!Employee_Id || !First_Name || !Last_Name || !Start_Date || !End_Date || !Reason) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  const query = `
    INSERT INTO Leave_Request (Employee_Id, First_Name, Last_Name, Leave_Type, Start_Date, End_Date, Reason, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  try {
    const [result] = await db.query(query, [
      Employee_Id,
      First_Name,
      Last_Name,
      Leave_Type || "Casual Leave", // default
      Start_Date,
      End_Date,
      Reason,
    ]);

    res.status(201).json({
      message: "Leave request submitted successfully",
      leaveId: result.insertId,
    });
  } catch (err) {
    console.error("Create Leave Error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ GET: Fetch All Leave Requests with pagination + search
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let searchCondition = "";
    let queryParams = [];

    if (search) {
      searchCondition = "WHERE First_Name LIKE ? OR Last_Name LIKE ? OR Employee_Id LIKE ?";
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Count total
    const countQuery = `SELECT COUNT(*) as total FROM Leave_Request ${searchCondition}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Data query
    const dataQuery = `
      SELECT * FROM Leave_Request 
      ${searchCondition} 
      ORDER BY Leave_Id DESC 
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...queryParams, limit, offset];
    const [rows] = await db.query(dataQuery, dataParams);

    res.json({
      data: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (err) {
    console.error("DB ERROR in getAllLeaveRequests:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET: Fetch Leave Request by ID
exports.getLeaveRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM Leave_Request WHERE Leave_Id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("DB ERROR in getLeaveRequestById:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ PUT: Update Leave Request (dates/reason/type)
exports.updateLeaveRequest = async (req, res) => {
  const { id } = req.params;
  const { Leave_Type, Start_Date, End_Date, Reason } = req.body;

  if (!Leave_Type || !Start_Date || !End_Date || !Reason) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    UPDATE Leave_Request 
    SET Leave_Type = ?, Start_Date = ?, End_Date = ?, Reason = ?
    WHERE Leave_Id = ?
  `;

  try {
    const [result] = await db.query(query, [Leave_Type, Start_Date, End_Date, Reason, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ PUT: Update Leave Status (Approve/Reject)
exports.updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE Leave_Request SET Status = ? WHERE Leave_Id = ?",
      [Status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json({ message: "Leave status updated successfully" });
  } catch (err) {
    console.error("Status Update Error:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ DELETE: Remove Leave Request
exports.deleteLeaveRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM Leave_Request WHERE Leave_Id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};
