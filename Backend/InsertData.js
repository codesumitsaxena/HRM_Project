const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Employee = require('./Model/employeeModel');

dotenv.config();

connectDB();
const employees = JSON.parse(fs.readFileSync('./MockData.json', 'utf-8'));
const importData = async () => {
  try {
    await Employee.insertMany(employees);
    console.log('Employee data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
