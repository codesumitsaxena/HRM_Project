// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Employee from "./Components/Employees/EmployeeTable";
import Department from "./Components/HR/DepartmentTable";
import React from "react";
import LeaveRequest from './Components/Employees/LeaveRequest'
import ProtectedRoute from "./Components/ProtectedRoutes"; // Add this
import "./App.css"; // Custom CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import "@fontsource/inter/400.css"; 
import "@fontsource/inter/600.css"; // Inter SemiBold
import "@fontsource/inter/700.css"; // Inter Bold
import AttendanceTable from './Components/Employees/AttendanceEmployee'
import HRLeaveDashboard from './Components/HR/HRDashboard'
import  HRleaveRequest from './Components/HR/HRLeaveRequest'
import EmployeeProfile from "./Components/Employees/EnployeeProfile";
import EmployeeDashboard from "./Components/Employees/EmployeeDashboard";



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
        path="/attendance/leave-request"
        element={
          <ProtectedRoute>
            <LeaveRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AttendanceTable />
          </ProtectedRoute>
        }
      />
       <Route
        path="/hr-dashboard"
        element={
          <ProtectedRoute>
            <HRLeaveDashboard />
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
        path="/employee-dashboard"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee-profile"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
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
        <Route
        path="/hr-leave-requests"
        element={
          <ProtectedRoute>
            <HRleaveRequest />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
