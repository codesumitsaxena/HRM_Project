const db = require('../config/db'); // MySQL connection file

// 🔍 Find user by email
exports.findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("DB ERROR in findUserByEmail:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// 🧾 Create new user
exports.createUser = (name, email, hashedPassword, callback) => {
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("DB ERROR in createUser:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};
