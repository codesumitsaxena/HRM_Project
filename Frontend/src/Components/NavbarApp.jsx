import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Button,
} from 'react-bootstrap';
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
} from 'react-icons/fa';
import LogoImg from '../assets/LogoImgg.png';

const NavbarTop = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null // Set to image URL if available
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Add your search logic here
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Add your logout logic here
  };

  return (
    <Navbar 
  expand="lg" 
  fixed="top"
  className="bg-white z-5 shadow-sm border-bottom"
  style={{
    background: "linear-gradient(to bottom right, #3fe2cd47, #ffffff42)",
    minHeight: "70px",
  }}
>

      <Container fluid className="px-4">
        {/* Logo Section */}
        <Navbar.Brand className="d-flex align-items-center me-4">
          <img 
            src={LogoImg} 
            alt="Logo" 
            className="img-fluid"
            style={{ 
              height: "45px", 
              width: "auto",
              objectFit: "contain"
            }} 
          />
        </Navbar.Brand>

        {/* Search Bar - Center */}
        <div className="flex-grow-1 d-flex justify-content-center mx-4">
          <Form 
            className="d-flex position-relative"
            style={{ maxWidth: '500px', width: '100%' }}
            onSubmit={handleSearch}
          >
            <div className="position-relative w-100">
              <FormControl
                type="search"
                placeholder="Search anything..."
                className="pe-5 border-0 shadow-sm"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '25px',
                  paddingLeft: '20px',
                  paddingRight: '50px',
                  height: '42px',
                  fontSize: '14px'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="link"
                type="submit"
                className="position-absolute end-0 top-50 translate-middle-y border-0 p-0 me-3"
                style={{ 
                  backgroundColor: 'transparent',
                  zIndex: 10
                }}
              >
                <FaSearch 
                  style={{ 
                    color: '#6c757d',
                    fontSize: '16px'
                  }} 
                />
              </Button>
            </div>
          </Form>
        </div>

        {/* Profile Dropdown - Right */}
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              id="profile-dropdown"
              className="d-flex align-items-center text-decoration-none border-0 shadow-none p-2"
              style={{
                backgroundColor: 'transparent',
                borderRadius: '25px',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                    style={{ width: '35px', height: '35px' }}
                  >
                    <FaUserCircle 
                      style={{ 
                        color: 'white', 
                        fontSize: '20px' 
                      }} 
                    />
                  </div>
                )}
                <div className="d-none d-md-block text-start">
                  <div 
                    className="fw-semibold text-dark mb-0"
                    style={{ fontSize: '14px', lineHeight: '1.2' }}
                  >
                    {user.name}
                  </div>
                  <div 
                    className="text-muted"
                    style={{ fontSize: '12px', lineHeight: '1.2' }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu 
              className="shadow border-0 mt-2"
              style={{ 
                minWidth: '220px',
                borderRadius: '12px',
                padding: '8px'
              }}
            >
              {/* User Info Header */}
              <div className="px-3 py-2 border-bottom mb-2">
                <div className="fw-semibold text-dark">{user.name}</div>
                <div className="text-muted" style={{ fontSize: '13px' }}>
                  {user.email}
                </div>
              </div>

              {/* Menu Items */}
              <Dropdown.Item 
                href="#/profile"
                className="d-flex align-items-center py-2 px-3 rounded"
                style={{ fontSize: '14px' }}
              >
                <FaUser className="me-3" style={{ width: '16px' }} />
                My Profile
              </Dropdown.Item>
              
              <Dropdown.Item 
                href="#/settings"
                className="d-flex align-items-center py-2 px-3 rounded"
                style={{ fontSize: '14px' }}
              >
                <FaCog className="me-3" style={{ width: '16px' }} />
                Settings
              </Dropdown.Item>

              <Dropdown.Divider className="my-2" />
              
              <Dropdown.Item 
                onClick={handleLogout}
                className="d-flex align-items-center py-2 px-3 rounded text-danger"
                style={{ fontSize: '14px' }}
              >
                <FaSignOutAlt className="me-3" style={{ width: '16px' }} />
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;