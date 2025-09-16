// backend/Model/UserModel.js
const db = require('../config/db');

// Create new user
exports.createUser = async ({ Full_Name, Email, Password, Role = 'user', Employee_Id = null }) => {
  const [result] = await db.query(
    'INSERT INTO users (Full_Name, Email, Password, Role, Employee_Id) VALUES (?, ?, ?, ?, ?)',
    [Full_Name, Email, Password, Role, Employee_Id]
  );
  return result.insertId;
};

// Find user by email
exports.findUserByEmail = async (Email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE Email = ? LIMIT 1',
    [Email]
  );
  return rows[0] || null;
};

// Find user by ID
exports.findUserById = async (User_Id) => {
  const [rows] = await db.query(
    'SELECT User_Id, Full_Name, Email, Role, Employee_Id FROM users WHERE User_Id = ? LIMIT 1',
    [User_Id]
  );
  return rows[0] || null;
};
