// NavbarTop.jsx - Final Component
import React from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import {
  FaSearch,
  FaCalendarAlt,
  FaComments,
  FaEnvelope,
  FaBell,
  FaSlidersH,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';
import LogoImg from '../assets/LogoImgg.png';

const NavbarTop = ({ onToggleSidebar }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Navbar
      expand="lg"
      className="navbarTop w-100 px-3 py-3 shadow-sm border-bottom"
    >
      <Container fluid className="align-items-center">
        {/* Mobile Sidebar Toggle - Only visible on mobile */}
        <Button 
          variant="outline-secondary" 
          className="d-lg-none me-2 border-0"
          onClick={onToggleSidebar}
          style={{ padding: '0.375rem 0.5rem' }}
        >
          <FaBars size={16} />
        </Button>

        {/* Logo */}
        <Navbar.Brand className="logoSearch text-info me-3">
          <img
            src={LogoImg}
            alt="Logo"
            className="img-fluid"
          />
        </Navbar.Brand>

        {/* Search Bar */}
        <div className="d-flex flex-grow-1 justify-content-center">
          <Form className="searchTopnav d-flex">
            <FormControl
              type="search"
              placeholder="Search here..."
              className="me-2"
              style={{ minWidth: '200px' }}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </Form>
        </div>

        {/* Toggle Button for mobile icons */}
        <Navbar.Toggle 
          aria-controls="navbar-icons" 
          className="border-0 ms-2" 
          style={{ padding: '0.25rem 0.5rem' }}
        />

        {/* Collapsible Icons */}
        <Navbar.Collapse id="navbar-icons">
          <Nav className="righticon ms-auto">
            <Nav.Link className="p-2">
              <FaCalendarAlt size={18} />
            </Nav.Link>
            <Nav.Link className="p-2">
              <FaComments size={18} />
            </Nav.Link>
            <Nav.Link className="p-2 position-relative">
              <FaEnvelope size={18} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-light rounded-circle"></span>
            </Nav.Link>
            <Nav.Link className="p-2 position-relative">
              <FaBell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-light rounded-circle"></span>
            </Nav.Link>
            <Nav.Link className="p-2">
              <FaSlidersH size={18} />
            </Nav.Link>
            <Nav.Link 
              className="p-2"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;