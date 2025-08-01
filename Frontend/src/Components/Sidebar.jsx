import React from 'react';
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

const Sidebar = () => {
    return (
        <>
            <div className='d-flex w-100'>
                <div style={{width:'40vh', background: '#f8f9fa', height: '100vh', padding: '20px' }}>
                    {/* Profile Section */}
                    <div className=" text-center mb-4">
                        <div className='d-flex'>
                            <Image
                                src='src/assets/react.svg'
                                roundedCircle
                                style={{ width: '70px', height: '70px' }}
                            />
                            <div className="ms-2 mt-2 text-align-left">
                                <span className="text-muted">Welcome</span><br />
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" className="p-0 fw-bold text-dark" >
                                        Jessica Doe
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Profile</Dropdown.Item>
                                        <Dropdown.Item>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-3 text-muted">
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

                    {/* Tabs */}
                    <Tab.Container defaultActiveKey="hr">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="hr">HR</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="project">Project</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled><IoGrid /></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled><FaCog /></Nav.Link>
                            </Nav.Item>

                        </Nav>

                        {/* Menu Items */}
                        <Tab.Content>
                            <Tab.Pane eventKey="hr">
                                <Nav className="flex-column">
                                    <Nav.Link><FaTachometerAlt className="me-2" />HR Dashboard</Nav.Link>
                                    <Nav.Link><FaUmbrellaBeach className="me-2" />Holidays</Nav.Link>
                                    <Nav.Link><FaCalendarAlt className="me-2" />Events</Nav.Link>
                                    <Nav.Link><FaRegListAlt className="me-2" />Activities</Nav.Link>
                                    <Nav.Link><FaProjectDiagram className="me-2" />HR Social</Nav.Link>
                                    <Dropdown className=" text-white rounded">
                                        <Dropdown.Toggle variant="link" id="dropdown-basic">
                                            <FaUsers className="me-2" />Employees
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Nav.Link><FaUsers className="me-2" />Accounts</Nav.Link>
                                </Nav>
                            </Tab.Pane>
                            <Tab.Pane eventKey="project">
                                <p>Project tab content...</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>

                </div>
                <div className='w-75'>
                    <DashboardHeader />
                </div>
            </div>
        </>
    );
};

export default Sidebar;

