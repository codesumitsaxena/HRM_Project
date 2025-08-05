
import { Tab, Nav, Image, Dropdown, Container } from 'react-bootstrap';
import {
    FaTachometerAlt,
    FaUmbrellaBeach,
    FaCalendarAlt,
    FaRegListAlt,
    FaUsers,
    FaProjectDiagram,
    FaCog
} from 'react-icons/fa';
import { IoGrid } from "react-icons/io5";
import DashboardHeader from './Dashboardheader';
import EmployeeTable from './EmployeeTable.jsx';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [showEmployees, setShowEmployees] = useState(false);

  const toggleEmployees = () => {
    setShowEmployees(!showEmployees);
  };
    return (
        <>
            <div className='d-flex w-100'>
                <div className='profile-section' >
                    {/* Profile Section */}
                    <div className=" mb-4">
                        <div className='d-flex'>
                            <Image
                                src='src/assets/aditya pic.jpg'
                                roundedCircle
                                style={{ width: '60px', height: '60px' }}
                            />
                            <div className="ms-3 mt-2 text-align-left">
                                <span className=" ms-1 text-muted">Welcome</span><br />
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" className="profilename p-0 " >
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
                                <small >Experience</small>
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

                    {/* Tabs */}
                    <Tab.Container defaultActiveKey="hr">
                        <Nav variant="tabs" className=" mb-3">
                            <Nav.Item>
                                <Nav.Link className='menutabs' >HR</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='menutabs' >Project</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled><IoGrid /></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled><FaCog /></Nav.Link>
                            </Nav.Item>
                        </Nav>

                        {/* Menu Items */}
                        <Tab.Content >
                            <Tab.Pane eventKey="hr">
                                <Nav className=" flex-column">
                                    <Nav.Link className='menuButton' ><FaTachometerAlt className=" me-2" />HR Dashboard</Nav.Link>
                                    <Nav.Link className='menuButton'><FaUmbrellaBeach className="me-2" />Holidays</Nav.Link>
                                    <Nav.Link className='menuButton'><FaCalendarAlt className="me-2" />Events</Nav.Link>
                                    <Nav.Link className='menuButton'><FaRegListAlt className="me-2" />Activities</Nav.Link>
                                    <Nav.Link className='menuButton'><FaProjectDiagram className="me-2" />HR Social</Nav.Link>
                                    <div>
                                        <Nav.Link
                                            onClick={toggleEmployees}
                                            className="menuButton"
                                        >
                                            <span><FaUsers className=" me-2" />Employees</span>
                                            {/* {showEmployees ? <FaChevronUp /> : <FaChevronDown />} */}
                                        </Nav.Link>

                                        {showEmployees && (
                                            <div className="ms-4">
                                                <Nav.Link as={NavLink} to="/employees/list" className="menuButton"> View All</Nav.Link>
                                                <Nav.Link as={NavLink} to="/employees/add" className="menuButton"> Add New</Nav.Link>
                                                <Nav.Link as={NavLink} to="/employees/roles" className="menuButton"> Manage Roles</Nav.Link>
                                            </div>
                                        )}
                                    </div>
                                    <Nav.Link className='menuButton'><FaUsers className="me-2" />Accounts</Nav.Link>
                                </Nav>
                            </Tab.Pane>
                            <Tab.Pane eventKey="project">
                                <p>Project tab content...</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>

                </div>
                <div className="lol" style={{width:"80%"}}>
                  <DashboardHeader />  
                 <EmployeeTable />   
                </div>
            </div>
        </>
    );
};

export default Sidebar;

