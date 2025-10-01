// src/App.jsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Employee from "./Components/Employees/EmployeeTable";
import Department from "./Components/HR/DepartmentTable";
import LeaveRequest from './Components/Employees/LeaveRequest';
import ProtectedRoute from "./Components/ProtectedRoutes";
import AttendanceTable from './Components/Employees/AttendanceEmployee';
import HRLeaveDashboard from './Components/HR/HRDashboard';
import HRleaveRequest from './Components/HR/HRLeaveRequest';
import EmployeeProfile from "./Components/Employees/EnployeeProfile";
import EmployeeDashboard from "./Components/Employees/EmployeeDashboard";
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminLeaveManagement from './Components/Admin/LeaveManagmentAdmin'; // Fixed import
import AttendanceManagement from './Components/HR/EmployeeAttendance'

// CSS imports
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />
          
          {/* Protected Routes - All routes now go through the unified Dashboard component */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Legacy routes for backwards compatibility - redirect to dashboard */}
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/daily"
            element={
              <ProtectedRoute>
                <AttendanceManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;