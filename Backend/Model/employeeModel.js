const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  designation: String,
  department: String,
  salary: Number,
  joiningDate: Date,
  phone: String,
  address: String,
  image: String
});

module.exports = mongoose.model('Employee', employeeSchema);
