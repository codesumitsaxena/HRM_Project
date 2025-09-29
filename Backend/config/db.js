const mysql = require('mysql2');  // Normal mysql2 import
const dotenv = require('dotenv');
dotenv.config();

// Create the connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Export the pool for use in other files
module.exports = db;
