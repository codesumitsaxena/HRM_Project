// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import DepartmentTable from './Components/DepartmentTable';
import LeaveRequest from './Components/LeaveRequest';

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
      <Route path="/DepartmentTable" element={<DepartmentTable />} />
      <Route path="/LeaveRequest" element={<LeaveRequest/>} />
      {/* Remove individual routes as they'll be handled within Dashboard */}
    </Routes>
  );
}

export default App;