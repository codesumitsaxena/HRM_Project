// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Employee from "./Components/EmployeeTable";
import Department from "./Components/DepartmentTable";
import React from "react";
import ProtectedRoute from "./Components/ProtectedRoutes"; // Add this
import "./App.css"; // Custom CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import "@fontsource/inter/400.css"; // Inter Regular
import "@fontsource/inter/600.css"; // Inter SemiBold
import "@fontsource/inter/700.css"; // Inter Bold

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Employee"
        element={
          <ProtectedRoute>
            <Employee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Department"
        element={
          <ProtectedRoute>
            <Department />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
