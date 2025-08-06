import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaUmbrellaBeach,
  FaCalendarAlt,
  FaRegListAlt,
  FaUsers,
  FaProjectDiagram,
  FaCog
} from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import NavbarTop from './NavbarApp';
import DashboardHeader from './Dashboardheader';
import EmployeeTable from './EmployeeTable';
import { Image, Dropdown, Nav, Tab } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // ✅ Needed for routing

const drawerWidth = 240;

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showEmployees, setShowEmployees] = useState(false); // ✅ FIXED

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const toggleEmployees = () => {
    setShowEmployees(!showEmployees);
  };

  return (
    <>
      {/* Top Navbar */}
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <NavbarTop />
      </Box>

      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: '22%',
            
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: '22%',
              top: 64,
              marginTop: '15px',
              zIndex: 999,
              boxSizing: 'border-box',
              height: 'calc(100% - 64px)',
              overflowY: 'scroll',
             '&::-webkit-scrollbar': { display: 'none' }
              // hides scrollbar completely // prevent overlap
            }
          }}
        >
          <List >
            <div className="profile-section px-3">
              <div className="mb-4">
                <div className="d-flex">
                  <Image
                    src="src/assets/aditya pic.jpg"
                    roundedCircle
                    style={{ width: '60px', height: '60px' }}
                  />
                  <div className="ms-3 mt-2 text-align-left">
                    <span className="ms-1 text-muted">Welcome</span>
                    <br />
                    <Dropdown>
                      <Dropdown.Toggle variant="link" className="profilename p-0">
                        Jessica Doe
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className="menutabs d-flex justify-content-between mt-3 text-muted">
                  <div className="text-center">
                    <div className="fw-bold">5+</div>
                    <small>Experience</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold">400+</div>
                    <small>Employees</small>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold">80+</div>
                    <small>Clients</small>
                  </div>
                </div>
              </div>

              <Tab.Container defaultActiveKey="hr">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link className="menutabs" eventKey="hr">
                      HR
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="menutabs" eventKey="project">
                      Project
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link disabled>
                      <IoGrid />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link disabled>
                      <FaCog />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="hr">
                    <Nav className="flex-column">
                      <Nav.Link className="menuButton">
                        <FaTachometerAlt className="me-2" /> HR Dashboard
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaUmbrellaBeach className="me-2" /> Holidays
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaCalendarAlt className="me-2" /> Events
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaRegListAlt className="me-2" /> Activities
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaProjectDiagram className="me-2" /> HR Social
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaUmbrellaBeach className="me-2" /> Holidays
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaCalendarAlt className="me-2" /> Events
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaRegListAlt className="me-2" /> Activities
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaProjectDiagram className="me-2" /> HR Social
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaCalendarAlt className="me-2" /> Events
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaRegListAlt className="me-2" /> Activities
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaProjectDiagram className="me-2" /> HR Social
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaCalendarAlt className="me-2" /> Events
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaRegListAlt className="me-2" /> Activities
                      </Nav.Link>
                      <Nav.Link className="menuButton">
                        <FaProjectDiagram className="me-2" /> HR Social
                      </Nav.Link>
                      

                      <Nav.Link onClick={toggleEmployees} className="menuButton">
                        <FaUsers className="me-2" /> Employees
                      </Nav.Link>

                      {showEmployees && (
                        <div className="ms-4">
                          <Nav.Link as={NavLink} to="/employees/list" className="menuButton">
                            View All
                          </Nav.Link>
                          <Nav.Link as={NavLink} to="/employees/add" className="menuButton">
                            Add New
                          </Nav.Link>
                          <Nav.Link as={NavLink} to="/employees/roles" className="menuButton">
                            Manage Roles
                          </Nav.Link>
                        </div>
                      )}

                      <Nav.Link className="menuButton">
                        <FaUsers className="me-2" /> Accounts
                      </Nav.Link>
                    </Nav>
                  </Tab.Pane>

                  <Tab.Pane eventKey="project">
                    <p>Project tab content...</p>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </List>
        </Drawer>

        {/* Main Content */}
              <Box
                  sx={{
                      width: '78%', // Remaining space after sidebar (100% - 22%)
                      flexGrow: 1,
                      marginTop: '70px', // Pushes content below the AppBar/NavbarTop
                      height: 'calc(100vh - 78px)', // Fits remaining screen height after navbar
                      overflowY: 'auto', // Scroll only inside content
                      padding: 3,
                      '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar (optional)
                  }}
              >
                  <DashboardHeader />
          <EmployeeTable />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
