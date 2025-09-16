// Sidebar.jsx - Final Component
import React from 'react';
import "./sidebar.css";
import { Nav } from 'react-bootstrap';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarCheck, 
  FaFileAlt,
  FaBuilding,
  FaUserShield,
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ onMenuClick, activeItem, show, onHide }) => {
  const menuItems = [
    { id: 'dashboard', label: 'HR Dashboard', icon: <FaTachometerAlt /> },
    { id: 'employees', label: 'All Employees', icon: <FaUsers /> },
    { id: 'leave-requests', label: 'Leave Requests', icon: <FaFileAlt /> },
    { id: 'departments', label: 'Departments', icon: <FaBuilding /> },
  ];

  const handleMenuClick = (itemId) => {
    onMenuClick(itemId);
  };

  const handleOtherMenuClick = (action) => {
    console.log('Other menu clicked:', action);
    // Handle other menu actions here
    if (window.innerWidth <= 991.98) {
      onHide();
    }
  };

  return (
    <div className={`sidebar bg-light border-end ${show ? 'show' : ''}`}>
      {/* User Profile Section */}
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3" 
               style={{ width: '40px', height: '40px' }}>
            <FaUsers className="text-white" />
          </div>
          <div>
            <div className="fw-semibold">Welcome</div>
            <div className="text-muted small">Jessica Doe</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-3 border-bottom">
        <div className="row text-center g-0">
          <div className="col-4">
            <div className="fw-bold text-primary">5+</div>
            <div className="small text-muted">Experience</div>
          </div>
          <div className="col-4">
            <div className="fw-bold text-success">400+</div>
            <div className="small text-muted">Employees</div>
          </div>
          <div className="col-4">
            <div className="fw-bold text-info">80+</div>
            <div className="small text-muted">Clients</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Nav className="flex-column p-2">
        <div className="mb-3">
          <div className="text-muted small fw-semibold px-3 py-2 text-uppercase">Main Menu</div>
          {menuItems.map((item) => (
            <Nav.Link
              key={item.id}
              className={`px-3 py-2 mb-1 rounded d-flex align-items-center text-decoration-none ${
                activeItem === item.id 
                  ? 'bg-primary text-white' 
                  : 'text-dark hover-bg-light'
              }`}
              onClick={() => handleMenuClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <span className="me-3" style={{ minWidth: '20px' }}>
                {item.icon}
              </span>
              {item.label}
            </Nav.Link>
          ))}
        </div>

        {/* Other Menu Items */}
        <div className="mt-auto">
          <div className="text-muted small fw-semibold px-3 py-2 text-uppercase">Others</div>
          <Nav.Link 
            className="px-3 py-2 mb-1 rounded d-flex align-items-center text-dark text-decoration-none"
            onClick={() => handleOtherMenuClick('users')}
            style={{ cursor: 'pointer' }}
          >
            <span className="me-3" style={{ minWidth: '20px' }}>
              <FaUserShield />
            </span>
            Users
          </Nav.Link>
          <Nav.Link 
            className="px-3 py-2 mb-1 rounded d-flex align-items-center text-dark text-decoration-none"
            onClick={() => handleOtherMenuClick('authentication')}
            style={{ cursor: 'pointer' }}
          >
            <span className="me-3" style={{ minWidth: '20px' }}>
              <FaUserShield />
            </span>
            Authentication
          </Nav.Link>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;