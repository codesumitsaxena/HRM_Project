import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Button,
  Badge,
} from 'react-bootstrap';
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaBars,
} from 'react-icons/fa';
import { useAuth } from '../Components/AuthContext'; // Adjust import path
import LogoImg from '../assets/LogoImgg.png'; // Adjust path

const DynamicNavbar = ({ onSidebarToggle, isSidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout, isAdmin, isHR, isManager, isEmployee } = useAuth();

  // Dynamic notifications system - replace with real API calls
  useEffect(() => {
    const fetchNotifications = () => {
      // Simulate API call with dynamic data based on current time and role
      const currentTime = new Date();
      const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let mockNotifications = [];

      if (isAdmin()) {
        mockNotifications = [
          {
            id: Date.now() + 1,
            message: "System backup completed successfully",
            type: "success",
            time: "Just now",
            isRead: false
          },
          {
            id: Date.now() + 2,
            message: "New employee registration requires approval",
            type: "warning",
            time: "2 min ago",
            isRead: false
          },
          {
            id: Date.now() + 3,
            message: "Monthly analytics report is ready",
            type: "info",
            time: "15 min ago",
            isRead: true
          },
          {
            id: Date.now() + 4,
            message: "Server maintenance scheduled for tonight",
            type: "warning",
            time: "1 hour ago",
            isRead: false
          }
        ];
      } else if (isHR()) {
        mockNotifications = [
          {
            id: Date.now() + 1,
            message: "5 new leave requests pending approval",
            type: "warning",
            time: "Just now",
            isRead: false
          },
          {
            id: Date.now() + 2,
            message: "Interview scheduled for tomorrow at 10 AM",
            type: "info",
            time: "30 min ago",
            isRead: false
          },
          {
            id: Date.now() + 3,
            message: "Employee onboarding document uploaded",
            type: "success",
            time: "2 hours ago",
            isRead: true
          }
        ];
      } else if (isManager()) {
        mockNotifications = [
          {
            id: Date.now() + 1,
            message: "Team performance review due next week",
            type: "info",
            time: "10 min ago",
            isRead: false
          },
          {
            id: Date.now() + 2,
            message: "Budget approval request submitted",
            type: "warning",
            time: "1 hour ago",
            isRead: false
          }
        ];
      } else if (isEmployee()) {
        mockNotifications = [
          {
            id: Date.now() + 1,
            message: "Your leave request has been approved",
            type: "success",
            time: "5 min ago",
            isRead: false
          },
          {
            id: Date.now() + 2,
            message: "Payslip for October is now available",
            type: "info",
            time: "2 hours ago",
            isRead: true
          }
        ];
      }

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    };

    fetchNotifications();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, isAdmin, isHR, isManager, isEmployee]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery);
      // Add your search logic here
      // You can also call a search function passed as prop
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'danger';
      case 'hr': return 'warning';
      case 'manager': return 'info';
      case 'employee': return 'success';
      default: return 'secondary';
    }
  };

  const getRoleDisplay = () => {
    return user?.role?.toUpperCase() || 'USER';
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className="shadow-sm border-bottom"
        style={{
          background: "linear-gradient(135deg, #3fe2cd47, #ffffff95)",
          minHeight: "auto",
          backdropFilter: "blur(10px)",
          zIndex: 1030
        }}
      >
        <Container fluid className="px-3">
          {/* Mobile Sidebar Toggle & Logo Section */}
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-3 border-0 d-lg-none"
              onClick={onSidebarToggle}
              style={{ backgroundColor: 'transparent' }}
            >
              <FaBars />
            </Button>

            <Navbar.Brand className="d-flex align-items-center me-4">
              <img
                src={LogoImg}
                alt="HRM Logo"
                className="img-fluid"
                style={{
                  height: "40px",
                  width: "auto",
                  objectFit: "contain"
                }}
              />
            </Navbar.Brand>
          </div>

          {/* Search Bar - Center (Hidden on small screens when mobile search is not active) */}
          <div className={`flex-grow-1 mx-4 ${showMobileSearch ? 'd-block' : 'd-none d-lg-block'}`}>
            <Form
              className="d-flex position-relative"
              style={{ maxWidth: '500px', margin: '0 auto' }}
              onSubmit={handleSearch}
            >
              <div className="position-relative w-100">
                <FormControl
                  type="search"
                  placeholder={`Search ${user.role === 'admin' ? 'employees, reports, settings...' :
                      user.role === 'hr' ? 'employees, leaves, reports...' :
                        user.role === 'manager' ? 'team members, performance...' :
                          'attendance, payslips...'}`}
                  className="pe-5 border-0 shadow-sm"
                  style={{
                    backgroundColor: 'rgba(248, 249, 250, 0.9)',
                    borderRadius: '25px',
                    paddingLeft: '20px',
                    paddingRight: '50px',
                    height: '42px',
                    fontSize: '14px',
                    backdropFilter: 'blur(5px)'
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

          {/* Right Side Controls */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Mobile Search Toggle */}
            <Button
              variant="link"
              className="d-lg-none text-secondary me-2 p-2 border-0"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              style={{ backgroundColor: 'transparent' }}
            >
              <FaSearch />
            </Button>

            {/* Role Badge */}
            <Badge
              bg={getRoleColor()}
              className="me-3 px-3 py-2 d-none d-md-inline"
              style={{
                fontSize: '11px',
                borderRadius: '15px',
                fontWeight: '600'
              }}
            >
              {getRoleDisplay()}
            </Badge>

            {/* Notifications Dropdown */}
            <Dropdown align="end" className="me-2" drop="down">
              <Dropdown.Toggle
                variant="link"
                className="text-decoration-none border-0 shadow-none p-2 position-relative"
                style={{ backgroundColor: 'transparent' }}
              >
                <FaBell style={{ fontSize: '18px', color: '#6c757d' }} />
                {unreadCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute"
                    style={{
                      fontSize: '10px',
                      top: '2px',
                      right: '2px',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="shadow border-0"
                style={{
                  minWidth: '360px',
                  maxWidth: '400px',
                  borderRadius: '15px',
                  padding: '0',
                  maxHeight: '500px',
                  // Fix: Remove overflowY: 'auto' from here and apply it to the content wrapper
                  transform: 'translateX(-20px)',
                  marginTop: '10px'
                }}
              >
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom bg-light" style={{ borderRadius: '15px 15px 0 0' }}>
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                  {notifications.length > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary p-0 text-decoration-none"
                      onClick={clearAllNotifications}
                      style={{ fontSize: '12px' }}
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Content with Scrollbar fix */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <FaBell className="mb-3" style={{ fontSize: '32px', opacity: 0.3 }} />
                      <div className="fw-semibold mb-1">No notifications</div>
                      <div style={{ fontSize: '13px' }}>You're all caught up!</div>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`d-flex align-items-start p-3 rounded mb-2 position-relative cursor-pointer transition-all ${
                            !notification.isRead ? 'bg-primary bg-opacity-10' : 'hover-bg-light'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            cursor: 'pointer',
                            border: !notification.isRead ? '1px solid rgba(13, 110, 253, 0.2)' : '1px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (notification.isRead) {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (notification.isRead) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {/* Status indicator */}
                          <div
                            className={`rounded-circle me-3 flex-shrink-0 d-flex align-items-center justify-content-center ${
                              notification.type === 'warning' ? 'bg-warning' :
                                notification.type === 'success' ? 'bg-success' :
                                  'bg-info'
                            }`}
                            style={{ width: '32px', height: '32px', minWidth: '32px' }}
                          >
                            <FaBell
                              style={{
                                fontSize: '14px',
                                color: 'white'
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div
                              className={`mb-1 ${!notification.isRead ? 'fw-semibold text-dark' : 'text-dark'}`}
                              style={{
                                fontSize: '14px',
                                lineHeight: '1.4',
                                wordBreak: 'break-word'
                              }}
                            >
                              {notification.message}
                            </div>
                            <div
                              className="text-muted d-flex align-items-center"
                              style={{ fontSize: '12px' }}
                            >
                              <span>{notification.time}</span>
                              {!notification.isRead && (
                                <span className="ms-2">
                                  <div
                                    className="bg-primary rounded-circle"
                                    style={{ width: '6px', height: '6px' }}
                                  />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div
                              className="position-absolute bg-primary rounded-circle"
                              style={{
                                width: '8px',
                                height: '8px',
                                top: '15px',
                                right: '10px'
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="text-center py-2 border-top">
                    <Button
                      variant="link"
                      className="text-primary text-decoration-none p-2"
                      style={{ fontSize: '13px' }}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown align="end" drop="down">
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
                  <div className="d-none d-lg-block text-start me-1">
                    <div
                      className="fw-semibold text-dark mb-0"
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.2',
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {getWelcomeMessage()}, {user.name.split(' ')[0]}
                    </div>
                    <div
                      className="text-muted"
                      style={{
                        fontSize: '12px',
                        lineHeight: '1.2',
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                  <FaChevronDown
                    className="d-none d-lg-inline"
                    style={{ fontSize: '12px', color: '#6c757d' }}
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="shadow border-0"
                style={{
                  minWidth: '280px',
                  borderRadius: '15px',
                  padding: '0',
                  // Fix: Remove redundant maxHeight and overflow from here
                  transform: 'translateX(-30px)',
                  marginTop: '10px'
                }}
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-bottom bg-light" style={{ borderRadius: '15px 15px 0 0' }}>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: '45px', height: '45px' }}
                    >
                      <FaUserCircle
                        style={{
                          color: 'white',
                          fontSize: '24px'
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark mb-1">{user.name}</div>
                      <div className="text-muted mb-2" style={{ fontSize: '13px' }}>
                        {user.email}
                      </div>
                      <Badge bg={getRoleColor()} style={{ fontSize: '11px', borderRadius: '8px' }}>
                        {getRoleDisplay()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Dropdown.Item
                    href="#/profile"
                    className="d-flex align-items-center py-3 px-4 border-0"
                    style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                  >
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <FaUser className="text-primary" style={{ fontSize: '14px' }} />
                    </div>
                    <div>
                      <div className="fw-semibold">My Profile</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>View and edit profile</div>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    href="#/settings"
                    className="d-flex align-items-center py-3 px-4 border-0"
                    style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                  >
                    <div
                      className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <FaCog className="text-success" style={{ fontSize: '14px' }} />
                    </div>
                    <div>
                      <div className="fw-semibold">Settings</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Preferences & privacy</div>
                    </div>
                  </Dropdown.Item>

                  {/* Role-specific quick actions */}
                  {isAdmin() && (
                    <Dropdown.Item
                      href="#/admin/system"
                      className="d-flex align-items-center py-3 px-4 border-0"
                      style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                    >
                      <div
                        className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <FaCog className="text-danger" style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <div className="fw-semibold">System Admin</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Manage system settings</div>
                      </div>
                    </Dropdown.Item>
                  )}

                  {(isHR() || isManager()) && (
                    <Dropdown.Item
                      href="#/reports"
                      className="d-flex align-items-center py-3 px-4 border-0"
                      style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                    >
                      <div
                        className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <FaBell className="text-info" style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <div className="fw-semibold">Quick Reports</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Generate reports</div>
                      </div>
                    </Dropdown.Item>
                  )}
                </div>

                <hr className="my-2 mx-3" />

                {/* Logout */}
                <div className="pb-2">
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center py-3 px-4 border-0 text-danger"
                    style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                  >
                    <div
                      className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <FaSignOutAlt className="text-danger" style={{ fontSize: '14px' }} />
                    </div>
                    <div>
                      <div className="fw-semibold">Sign Out</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Logout from account</div>
                    </div>
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          className="d-lg-none position-fixed w-100"
          style={{
            top: '70px',
            zIndex: 1025,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '15px'
          }}
        >
          <Form onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder={`Search ${user.role === 'admin' ? 'anything...' :
                  user.role === 'hr' ? 'employees, leaves...' :
                    user.role === 'manager' ? 'team, performance...' :
                      'attendance, payslips...'}`}
              className="border-0 shadow-sm"
              style={{
                backgroundColor: 'rgba(248, 249, 250, 0.9)',
                borderRadius: '25px',
                paddingLeft: '20px',
                height: '42px',
                fontSize: '14px'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </Form>
        </div>
      )}
    </>
  );
};

export default DynamicNavbar;