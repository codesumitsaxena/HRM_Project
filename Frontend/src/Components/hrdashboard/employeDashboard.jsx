import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Image, Badge, ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';

const EmployeeDashboard = () => {
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  
  const employees = [
    {
      id: 1,
      name: "Marshall Nichols",
      designation: "UI UX Designer",
      performance: "Good",
      performanceColor: "success",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      details: {
        experience: "3 years",
        projects: "12 completed",
        rating: "4.2/5",
        department: "Design",
        email: "marshall.nichols@company.com",
        joinDate: "Jan 2022"
      }
    },
    {
      id: 2,
      name: "Susie Willis",
      designation: "Designer",
      performance: "Average",
      performanceColor: "warning",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      details: {
        experience: "2 years",
        projects: "8 completed",
        rating: "3.8/5",
        department: "Design",
        email: "susie.willis@company.com",
        joinDate: "Mar 2023"
      }
    },
    {
      id: 3,
      name: "Francisco Vasquez",
      designation: "Team Leader",
      performance: "Excellent",
      performanceColor: "info",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      details: {
        experience: "5 years",
        projects: "25 completed",
        rating: "4.8/5",
        department: "Management",
        email: "francisco.vasquez@company.com",
        joinDate: "Aug 2020"
      }
    },
    {
      id: 4,
      name: "Erin Gonzales",
      designation: "Android Developer",
      performance: "Weak",
      performanceColor: "danger",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      details: {
        experience: "1 year",
        projects: "3 completed",
        rating: "3.2/5",
        department: "Development",
        email: "erin.gonzales@company.com",
        joinDate: "Nov 2023"
      }
    },
    {
      id: 5,
      name: "Ava Alexander",
      designation: "UI UX Designer",
      performance: "Good",
      performanceColor: "success",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      details: {
        experience: "4 years",
        projects: "18 completed",
        rating: "4.5/5",
        department: "Design",
        email: "ava.alexander@company.com",
        joinDate: "Jun 2021"
      }
    }
  ];

  const PerformanceChart = ({ performance }) => {
    let now;
    switch(performance) {
      case 'Excellent':
        now = 100;
        break;
      case 'Good':
        now = 80;
        break;
      case 'Average':
        now = 60;
        break;
      case 'Weak':
        now = 30;
        break;
      default:
        now = 50;
    }
    
    return (
      <ProgressBar 
        now={now} 
        variant="info" 
        style={{ height: '8px' }} 
        className="mt-2"
      />
    );
  };

  const DonutChart = ({ malePercentage, femalePercentage }) => {
    const maleDeg = (malePercentage / 100) * 360;
    const femaleDeg = (femalePercentage / 100) * 360;
    
    return (
      <div className="donut-chart">
        <div 
          className="donut-segment male" 
          style={{ 
            transform: `rotate(${maleDeg}deg)`,
            clipPath: maleDeg <= 180 ? 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)' : 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0)'
          }}
        ></div>
        <div 
          className="donut-segment female" 
          style={{ 
            transform: `rotate(${maleDeg + femaleDeg}deg)`,
            clipPath: femaleDeg <= 180 ? 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)' : 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0)'
          }}
        ></div>
        <div className="donut-center">
          <div>Total</div>
          <div>100</div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="py-4 bg-light">
      <Row>
        {/* Employee Performance Section */}
        <Col xl={9} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Employee Performance</Card.Title>
              
              {/* Desktop Table View */}
              <div className="d-none d-md-block">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Performance</th>
                      <th>Chart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr 
                        key={employee.id}
                        className="align-middle"
                      >
                        <td>
                          <Image 
                            src={employee.avatar} 
                            roundedCircle 
                            width={40} 
                            height={40} 
                            className={hoveredEmployee === employee.id ? "border border-primary" : ""}
                          />
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">{employee.name}</div>
                            {hoveredEmployee === employee.id && (
                              <div className="small text-muted mt-1">
                                <div>{employee.details.experience} • {employee.details.department}</div>
                                <div>{employee.details.projects} • Rating: {employee.details.rating}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{employee.designation}</div>
                            {hoveredEmployee === employee.id && (
                              <div className="small text-muted mt-1">
                                <div>📧 {employee.details.email}</div>
                                <div>📅 Joined: {employee.details.joinDate}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge pill bg={employee.performanceColor}>
                            {employee.performance}
                          </Badge>
                        </td>
                        <td>
                          <PerformanceChart performance={employee.performance} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="d-md-none">
                {employees.map((employee) => (
                  <Card 
                    key={employee.id} 
                    className="mb-3"
                  >
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <Image 
                          src={employee.avatar} 
                          roundedCircle 
                          width={48} 
                          height={48} 
                          className="me-3"
                        />
                        <div>
                          <div className="fw-medium">{employee.name}</div>
                          <div className="small text-muted">{employee.designation}</div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge pill bg={employee.performanceColor}>
                          {employee.performance}
                        </Badge>
                        <PerformanceChart performance={employee.performance} />
                      </div>
                     
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Employee Structure Section */}
        <Col xl={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Employee Structure</Card.Title>
              
              <div className="text-center">
                {/* Donut Chart */}
                <div 
                  className="position-relative mx-auto mb-4"
                  style={{ width: '160px', height: '160px' }}
                  onMouseEnter={() => setHoveredEmployee('chart')}
                  onMouseLeave={() => setHoveredEmployee(null)}
                >
                  <DonutChart malePercentage={73} femalePercentage={27} />
                  
                </div>
                {/* Legend */}
                <Row className="justify-content-center">
                  <Col xs={6} md={12} className="mb-3 mb-md-0">
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="male-tooltip">
                          <div className="text-start">
                            <div className="fw-bold mb-2">Male Employees</div>
                            <div className="small">
                              <div className="d-flex justify-content-between">
                                <span>Total:</span>
                                <span className="fw-medium">73 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Managers:</span>
                                <span className="fw-medium">12 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Developers:</span>
                                <span className="fw-medium">35 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Designers:</span>
                                <span className="fw-medium">26 people</span>
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      }
                    >
                      <div 
                        className="p-3"
                        onMouseEnter={() => setHoveredEmployee('male')}
                        onMouseLeave={() => setHoveredEmployee(null)}
                      >
                        <div className="d-flex align-items-center justify-content-center mb-1">
                          <span className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                          <span className="small">Male</span>
                        </div>
                        <div className="h4 fw-bold">73%</div>
                      </div>
                    </OverlayTrigger>
                  </Col>
                  
                  <Col xs={6} md={12}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="female-tooltip">
                          <div className="text-start">
                            <div className="fw-bold mb-2">Female Employees</div>
                            <div className="small">
                              <div className="d-flex justify-content-between">
                                <span>Total:</span>
                                <span className="fw-medium">27 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Managers:</span>
                                <span className="fw-medium">5 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Developers:</span>
                                <span className="fw-medium">8 people</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Designers:</span>
                                <span className="fw-medium">14 people</span>
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      }
                    >
                      <div 
                        className="p-3"
                      >
                        <div className="d-flex align-items-center justify-content-center mb-1">
                          <span className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: '#14b8a6', borderRadius: '50%' }}></span>
                          <span className="small">Female</span>
                        </div>
                        <div className="h4 fw-bold">27%</div>
                      </div>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CSS for Donut Chart */}
      <style>
        {`
          .donut-chart {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #f3f4f6;
          }
          
          .donut-segment {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            transform-origin: 50% 50%;
          }
          
          .donut-segment.male {
            background-color: #f59e0b;
          }
          
          .donut-segment.female {
            background-color: #14b8a6;
          }
          
          .donut-center {
            position: absolute;
            width: 60%;
            height: 60%;
            background-color: white;
            border-radius: 50%;
            top: 20%;
            left: 20%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          }
        `}
      </style>
    </Container>
  );
};

export default EmployeeDashboard;