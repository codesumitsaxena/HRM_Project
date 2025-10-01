// Dashboard.jsx - Complete Responsive Implementation
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import NavbarTop from './NavbarApp';
import { 
  Home, Users, UserPlus, Clock, FileText, BarChart3, 
  Settings, Shield, ChevronDown, ChevronRight, Menu, X, 
  UserCircle, DollarSign
} from 'lucide-react';

// Import all components
import EmployeeTable from './Employees/EmployeeTable';
import DepartmentTable from './HR/DepartmentTable';
import LeaveRequest from './Employees/LeaveRequest';
import AttendanceTable from './Employees/AttendanceEmployee';
import HRLeaveDashboard from './HR/HRDashboard';
import HRleaveRequest from './HR/HRLeaveRequest';
import EmployeeDashboard from './Employees/EmployeeDashboard';
import EmployeeProfile from './Employees/EnployeeProfile';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLeaveManagement from './Admin/LeaveManagmentAdmin';
import AttendanceManagement from './HR/EmployeeAttendance';

const DashboardHome = () => {
  return (
    <div className="bg-white rounded shadow-sm p-3 p-md-4">
      <h4 className="h5 h4-md mb-3">Dashboard Overview</h4>
      <p className="mb-0 small text-muted">Welcome to the HRM System Dashboard.</p>
    </div>
  );
};

const GenericPage = ({ title }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3 p-md-4">
      <h4 className="h5 h4-md mb-3">{title}</h4>
      <p className="small text-muted mb-3">This is the {title.toLowerCase()} page.</p>
      <div className="alert alert-info small mb-0">
        <strong>Coming Soon!</strong> This feature is under development.
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const { user, logout } = useAuth();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set initial menu based on role
  useEffect(() => {
    if (user) {
      const roleMenuMap = {
        admin: 'adminDashboard',
        hr: 'HRdashboard',
        employee: 'employee-dashboard'
      };
      setActiveMenu(roleMenuMap[user.role] || 'dashboard');
    }
  }, [user]);

  // Role-based menu configuration
  const menuItems = {
    admin: [
      { id: 'adminDashboard', title: 'Admin Dashboard', icon: Home, component: 'AdminDashboard' },
      {
        id: 'role-dashboards', title: 'Role Dashboards', icon: Shield, hasSubmenu: true,
        submenu: [
          { id: 'HRdashboard', title: 'HR Dashboard', component: 'HRDashboard' },
          { id: 'employee-dashboard', title: 'Employee Dashboard', component: 'EmployeeDashboard' }
        ]
      },
      {
        id: 'employees', title: 'Employees', icon: Users, hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', component: 'EmployeeTable' },
          { id: 'departments', title: 'Departments', component: 'DepartmentTable' }
        ]
      },
      {
        id: 'attendance', title: 'Attendance', icon: Clock, hasSubmenu: true,
        submenu: [
          { id: 'attendance-management', title: 'Daily Attendance', component: 'AttendanceManagement' },
          { id: 'admin-leave-management', title: 'Leave Management', component: 'AdminLeaveManagement' },
          { id: 'hr-leave-requests', title: 'Leave Requests', component: 'HRleaveRequest' },
          { id: 'employee-attendance', title: 'History', component: 'AttendanceTable' }
        ]
      },
      {
        id: 'payroll', title: 'Payroll', icon: DollarSign, hasSubmenu: true,
        submenu: [
          { id: 'salary-structure', title: 'Salary Structure' },
          { id: 'payslips', title: 'Pay Slips' }
        ]
      },
      {
        id: 'performance', title: 'Performance', icon: BarChart3, hasSubmenu: true,
        submenu: [
          { id: 'appraisals', title: 'Appraisals' },
          { id: 'goals', title: 'Goals & KPIs' }
        ]
      },
      {
        id: 'reports', title: 'Reports', icon: FileText, hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports' },
          { id: 'attendance-reports', title: 'Attendance Reports' }
        ]
      },
      { id: 'employee-profile', title: 'My Profile', icon: UserCircle, component: 'EmployeeProfile' },
      {
        id: 'settings', title: 'Settings', icon: Settings, hasSubmenu: true,
        submenu: [
          { id: 'company-settings', title: 'Company Settings' },
          { id: 'user-roles', title: 'User Roles' }
        ]
      }
    ],
    hr: [
      { id: 'HRdashboard', title: 'HR Dashboard', icon: Home, component: 'HRDashboard' },
      {
        id: 'employees', title: 'Employees', icon: Users, hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', component: 'EmployeeTable' }
        ]
      },
      {
        id: 'recruitment', title: 'Recruitment', icon: UserPlus, hasSubmenu: true,
        submenu: [
          { id: 'job-postings', title: 'Job Postings' },
          { id: 'applications', title: 'Applications' }
        ]
      },
      {
        id: 'attendance', title: 'Attendance', icon: Clock, hasSubmenu: true,
        submenu: [
          { id: 'attendance-management', title: 'Daily Attendance', component: 'AttendanceManagement' },
          { id: 'hr-leave-requests', title: 'HR Leave Requests', component: 'HRleaveRequest' },
          { id: 'employee-attendance', title: 'Attendance-Mark & History', component: 'AttendanceTable' }
        ]
      },
      { id: 'employee-profile', title: 'My Profile', icon: UserCircle, component: 'EmployeeProfile' }
    ],
    employee: [
      { id: 'employee-dashboard', title: 'My Dashboard', icon: Home, component: 'EmployeeDashboard' },
      { id: 'employee-profile', title: 'My Profile', icon: UserCircle, component: 'EmployeeProfile' },
      {
        id: 'attendance', title: 'My Attendance', icon: Clock, hasSubmenu: true,
        submenu: [
          { id: 'employee-attendance', title: 'History', component: 'AttendanceTable' },
          { id: 'leave-request', title: 'Leave Request', component: 'LeaveRequest' }
        ]
      },
      {
        id: 'payroll', title: 'My Payroll', icon: DollarSign, hasSubmenu: true,
        submenu: [
          { id: 'payslips', title: 'Pay Slips' }
        ]
      }
    ]
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuClick = (menuId, hasSubmenu = false) => {
    if (hasSubmenu) {
      toggleSubmenu(menuId);
    } else {
      setActiveMenu(menuId);
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleSubmenuClick = (submenuId) => {
    setActiveMenu(submenuId);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    if (activeMenu === 'dashboard') return <DashboardHome />;

    const componentMap = {
      'adminDashboard': <AdminDashboard />,
      'HRdashboard': <HRLeaveDashboard />,
      'employee-dashboard': <EmployeeDashboard />,
      'employee-profile': <EmployeeProfile />,
      'all-employees': <EmployeeTable />,
      'departments': <DepartmentTable />,
      'leave-request': <LeaveRequest />,
      'employee-attendance': <AttendanceTable />,
      'hr-leave-requests': <HRleaveRequest />,
      'attendance-management': <AttendanceManagement />,
      'admin-leave-management': <AdminLeaveManagement />
    };

    return componentMap[activeMenu] || <GenericPage title={activeMenu.replace(/-/g, ' ')} />;
  };

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeMenu === item.id;

    return (
      <div className="mb-1">
        <div
          className={`d-flex align-items-center p-2 rounded cursor-pointer transition-all ${
            isActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
          }`}
          onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
          style={{ cursor: 'pointer', fontSize: '13px' }}
        >
          {Icon && <Icon size={16} className="me-2 flex-shrink-0" />}
          {!isCollapsed && (
            <>
              <span className="flex-grow-1 text-truncate">{item.title}</span>
              {item.hasSubmenu && (
                <span className="flex-shrink-0">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              )}
            </>
          )}
        </div>

        {item.hasSubmenu && isExpanded && !isCollapsed && (
          <div className="ms-3">
            {item.submenu.map(subItem => {
              const isSubActive = activeMenu === subItem.id;
              return (
                <div
                  key={subItem.id}
                  className={`d-flex align-items-center p-2 rounded cursor-pointer transition-all ${
                    isSubActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmenuClick(subItem.id);
                  }}
                  style={{ cursor: 'pointer', fontSize: '12px' }}
                >
                  <span className="text-truncate">{subItem.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const currentMenuItems = user ? (menuItems[user.role] || []) : [];

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary"></div>
    </div>;
  }

  return (
    <>
      {/* Navbar */}
      <NavbarTop onSidebarToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div className="dashboard-wrapper">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`sidebar bg-white shadow-lg ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
            {!isCollapsed && (
              <h6 className="mb-0 fw-bold text-primary text-truncate" style={{ fontSize: '13px' }}>
                {user.role.toUpperCase()} PANEL
              </h6>
            )}
            <button
              className="btn btn-outline-secondary btn-sm d-none d-md-block"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu size={14} /> : <X size={14} />}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm d-md-none"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          <div className="sidebar-menu p-2">
            {currentMenuItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-container">
            {renderContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          padding-top: 70px;
          position: relative;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }

        .sidebar {
          position: fixed;
          top: 70px;
          left: 0;
          height: calc(100vh - 70px);
          overflow-y: auto;
          overflow-x: hidden;
          transition: all 0.3s ease;
          z-index: 1050;
        }

        .sidebar-expanded {
          width: 260px;
        }

        .sidebar-collapsed {
          width: 70px;
        }

        .sidebar-menu {
          max-height: calc(100vh - 130px);
          overflow-y: auto;
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 5px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .sidebar-collapsed ~ .main-content {
          margin-left: 70px;
        }

        .content-container {
          padding: 20px;
        }

        .cursor-pointer {
          cursor: pointer;
        }
        
        .hover-bg-light:hover {
          background: linear-gradient(135deg, #3fe2cd15, #ffffff90) !important;
          color: #2c5f5d !important;
        }
        
        .transition-all {
          transition: all 0.2s ease;
        }

        .text-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        @media (max-width: 767.98px) {
          .sidebar {
            transform: translateX(-100%);
            width: 280px !important;
            top: 70px;
          }

          .sidebar-mobile-open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0 !important;
          }

          .content-container {
            padding: 15px;
          }
        }

        @media (min-width: 768px) and (max-width: 991.98px) {
          .sidebar-expanded {
            width: 220px;
          }

          .main-content {
            margin-left: 220px;
          }

          .sidebar-collapsed ~ .main-content {
            margin-left: 70px;
          }
        }

        @media (max-width: 575.98px) {
          .sidebar {
            width: 100% !important;
          }

          .content-container {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;