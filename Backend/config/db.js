const mysql = require('mysql2');
<<<<<<< HEAD
require('dotenv').config();
=======
const dotenv = require('dotenv');
dotenv.config();
>>>>>>> ef8af0fda68bec7e1b114289463c4f796226fcef

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
<<<<<<< HEAD
  console.log('✅ MySQL connected.');
=======
  console.log("✅ MySQL connected");
>>>>>>> ef8af0fda68bec7e1b114289463c4f796226fcef
});

module.exports = db;
