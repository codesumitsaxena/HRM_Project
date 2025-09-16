// Dashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HRDashboard from './hrdashboard/hrdashboard';
import NavbarTop from './NavbarApp';
import Sidebar from './Sidebar';
import EmployeeTable from './EmployeeTable';
import DepartmentTable from './DepartmentTable';
import LeaveRequest from './LeaveRequest';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <HRDashboard />;
      case 'employees':
        return <EmployeeTable />;
      case 'departments':
        return <DepartmentTable />;
      case 'leave-requests':
        return <LeaveRequest />;
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Static Navbar */}
      <NavbarTop />
      
      <div className="d-flex flex-grow-1">
        {/* Static Sidebar */}
        <Sidebar onMenuClick={setActiveComponent} activeItem={activeComponent} />
        
        {/* Main Content Area */}
        <div className="flex-grow-1 overflow-auto">
          <Container fluid className="p-0">
            {renderMainContent()}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;