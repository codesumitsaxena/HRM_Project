// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Employee from './Components/EmployeeTable'
import Department from './Components/DepartmentTable'
import React from 'react';
import './App.css'; // Custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons
import '@fontsource/inter/400.css'; // Inter Regular
import '@fontsource/inter/600.css'; // Inter SemiBold (optional)
import '@fontsource/inter/700.css'; // Inter Bold (optional)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Employee" element={<Employee />} />
      <Route path="/Department" element={<Department />} />

      
    </Routes>
  );
}

export default App;
