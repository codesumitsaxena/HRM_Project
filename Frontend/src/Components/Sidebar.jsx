import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext';
import { 
  Home, Users, UserPlus, Calendar, DollarSign, Clock, 
  FileText, BarChart3, Settings, Shield, LogOut, 
  ChevronDown, ChevronRight, Menu, X, Plus, UserCircle 
} from 'lucide-react';

// Import your components
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
    <div>
      <div className="bg-white rounded shadow-sm p-3 p-md-4">
        <h4 className="h5 h4-md">Dashboard Overview</h4>
        <p className="mb-0 small">Welcome to the HRM System Dashboard. Here you can view all the important metrics and information.</p>
      </div>
    </div>
  );
};

const GenericPage = ({ title }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3 p-md-4">
      <h4 className="h5 h4-md">{title}</h4>
      <p className="small">This is the {title.toLowerCase()} page. Content will be implemented here.</p>
      <div className="alert alert-info small">
        <strong>Coming Soon!</strong> This feature is under development.
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const { user, logout, isAdmin, isHR, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when screen size changes
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

  // Set active menu based on current route or user role
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          setActiveMenu('adminDashboard');
          break;
        case 'hr':
          setActiveMenu('HRdashboard');
          break;
        case 'manager':
          setActiveMenu('managerDashboard');
          break;
        case 'employee':
          setActiveMenu('employee-dashboard');
          break;
        default:
          setActiveMenu('dashboard');
      }
    }
  }, [user]);

  // Role-based menu configuration
  const menuItems = {
    admin: [
      {
        id: 'adminDashboard',
        title: 'Admin Dashboard',
        icon: Home,
        path: '/adminDashboard',
        component: 'AdminDashboard'
      },
      {
        id: 'role-dashboards',
        title: 'Role Dashboards',
        icon: Shield,
        hasSubmenu: true,
        submenu: [
          { id: 'HRdashboard', title: 'HR Dashboard', path: '/hr-dashboard', component: 'HRDashboard' },
          { id: 'employee-dashboard', title: 'Employee Dashboard', path: '/employee-dashboard', component: 'EmployeeDashboard' }
        ]
      },
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        path: '/Employee',
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'departments', title: 'Departments', path: '/Department', component: 'DepartmentTable' }
        ]
      },
      {
        id: 'attendance',
        title: 'Attendance & Leave',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance' },
          { id: 'monthly-report', title: 'Monthly Reports', path: '/attendance/monthly', component: 'MonthlyAttendance' },
          { id: 'admin-leave-management', title: 'Leave Management', path: '/admin/attendance/leaves', component: 'AdminLeaveManagement' },
          { id: 'hr-leave-requests', title: 'HR Leave Requests', path: '/hr-leave-requests', component: 'HRleaveRequest' },
          { id: 'leave-request', title: 'Leave Request', path: '/attendance/leave-request', component: 'LeaveRequest' },
          { id: 'employee-attendance', title: 'Attendance History', path: '/employee-attendance', component: 'AttendanceTable' }
        ]
      },
      {
        id: 'payroll',
        title: 'Payroll',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'salary-structure', title: 'Salary Structure', path: '/payroll/structure', component: 'SalaryStructure' },
          { id: 'payroll-processing', title: 'Processing', path: '/payroll/processing', component: 'PayrollProcessing' },
          { id: 'payslips', title: 'Pay Slips', path: '/payroll/payslips', component: 'PaySlips' },
          { id: 'tax-management', title: 'Tax Management', path: '/payroll/tax', component: 'TaxManagement' }
        ]
      },
      {
        id: 'performance',
        title: 'Performance',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals' },
          { id: 'goals', title: 'Goals & KPIs', path: '/performance/goals', component: 'Goals' },
          { id: 'reviews', title: 'Reviews', path: '/performance/reviews', component: 'PerformanceReviews' },
          { id: 'team-performance', title: 'Team Performance', path: '/performance/team', component: 'TeamPerformance' }
        ]
      },
      {
        id: 'reports',
        title: 'Reports',
        icon: FileText,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports', path: '/reports/employees', component: 'EmployeeReports' },
          { id: 'attendance-reports', title: 'Attendance Reports', path: '/reports/attendance', component: 'AttendanceReports' },
          { id: 'payroll-reports', title: 'Payroll Reports', path: '/reports/payroll', component: 'PayrollReports' },
          { id: 'analytics', title: 'Analytics', path: '/reports/analytics', component: 'HRAnalytics' }
        ]
      },
      {
        id: 'employee-profile',
        title: 'My Profile',
        icon: UserCircle,
        path: '/employee-profile',
        component: 'EmployeeProfile'
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: Settings,
        hasSubmenu: true,
        submenu: [
          { id: 'company-settings', title: 'Company Settings', path: '/settings/company', component: 'CompanySettings' },
          { id: 'user-roles', title: 'User Roles', path: '/settings/roles', component: 'UserRoles' },
          { id: 'permissions', title: 'Permissions', path: '/settings/permissions', component: 'Permissions' }
        ]
      }
    ],
    hr: [
      {
        id: 'HRdashboard',
        title: 'HR Dashboard',
        icon: Home,
        path: '/hr-dashboard',
        component: 'HRDashboard'
      },
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' }
        ]
      },
      {
        id: 'recruitment',
        title: 'Recruitment',
        icon: UserPlus,
        hasSubmenu: true,
        submenu: [
          { id: 'job-postings', title: 'Job Postings', path: '/recruitment/jobs', component: 'JobPostings' },
          { id: 'applications', title: 'Applications', path: '/recruitment/applications', component: 'Applications' },
          { id: 'interviews', title: 'Interviews', path: '/recruitment/interviews', component: 'Interviews' }
        ]
      },
      {
        id: 'attendance',
        title: 'Attendance',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'attendance-management', title: 'Daily Attendance', path: '/attendance/daily', component: 'AttendanceManagement' },
          { id: 'hr-leave-requests', title: 'Leave Requests', path: '/hr-leave-requests', component: 'HRleaveRequest' },
          { id: 'employee-attendance', title: 'Attendance History', path: '/employee-attendance', component: 'AttendanceTable' }
        ]
      },
      {
        id: 'employee-profile',
        title: 'My Profile',
        icon: UserCircle,
        path: '/employee-profile',
        component: 'EmployeeProfile'
      },
      {
        id: 'reports',
        title: 'Reports',
        icon: FileText,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports', path: '/reports/employees', component: 'EmployeeReports' },
          { id: 'attendance-reports', title: 'Attendance Reports', path: '/reports/attendance', component: 'AttendanceReports' }
        ]
      }
    ],
    employee: [
      {
        id: 'employee-dashboard',
        title: 'My Dashboard',
        icon: Home,
        path: '/employee-dashboard',
        component: 'EmployeeDashboard'
      },
      {
        id: 'employee-profile',
        title: 'My Profile',
        icon: UserCircle,
        path: '/employee-profile',
        component: 'EmployeeProfile'
      },
      {
        id: 'attendance',
        title: 'My Attendance',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'check-in-out', title: 'Check In/Out', path: '/attendance/checkin', component: 'CheckInOut' },
          { id: 'employee-attendance', title: 'History', path: '/employee-attendance', component: 'AttendanceTable' },
          { id: 'leave-request', title: 'Leave Request', path: '/attendance/leave-request', component: 'LeaveRequest' }
        ]
      },
      {
        id: 'payroll',
        title: 'My Payroll',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'payslips', title: 'Pay Slips', path: '/payroll/my-payslips', component: 'MyPaySlips' },
          { id: 'tax-documents', title: 'Tax Documents', path: '/payroll/tax-docs', component: 'TaxDocuments' }
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
      // Close mobile menu when item is clicked
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleSubmenuClick = (submenuId) => {
    setActiveMenu(submenuId);
    // Close mobile menu when submenu item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    if (activeMenu === 'dashboard') {
      return <DashboardHome />;
    }

    const componentMap = {
      'adminDashboard': <AdminDashboard />,
      'HRdashboard': <HRLeaveDashboard />,
      'managerDashboard': <GenericPage title="Manager Dashboard" />,
      'employee-dashboard': <EmployeeDashboard />,
      'employee-profile': <EmployeeProfile />,
      'all-employees': <EmployeeTable />,
      'employee-profiles': <EmployeeTable />,
      'departments': <DepartmentTable />,
      'leave-request': <LeaveRequest />,
      'employee-attendance': <AttendanceTable />,
      'hr-leave-requests': <HRleaveRequest />,
      'attendance-management': <AttendanceManagement />,
      'admin-leave-management': <AdminLeaveManagement />,
      'monthly-report': <GenericPage title="Monthly Reports" />,
      'overtime': <GenericPage title="Overtime Tracking" />,
      'job-postings': <GenericPage title="Job Postings" />,
      'applications': <GenericPage title="Applications" />,
      'interviews': <GenericPage title="Interviews" />,
      'salary-structure': <GenericPage title="Salary Structure" />,
      'payroll-processing': <GenericPage title="Payroll Processing" />,
      'payslips': <GenericPage title="Pay Slips" />,
      'tax-management': <GenericPage title="Tax Management" />,
      'appraisals': <GenericPage title="Appraisals" />,
      'goals': <GenericPage title="Goals & KPIs" />,
      'reviews': <GenericPage title="Performance Reviews" />,
      'team-performance': <GenericPage title="Team Performance" />,
      'team-members': <GenericPage title="Team Members" />,
      'team-attendance': <GenericPage title="Team Attendance" />,
      'employee-reports': <GenericPage title="Employee Reports" />,
      'attendance-reports': <GenericPage title="Attendance Reports" />,
      'payroll-reports': <GenericPage title="Payroll Reports" />,
      'analytics': <GenericPage title="HR Analytics" />,
      'company-settings': <GenericPage title="Company Settings" />,
      'user-roles': <GenericPage title="User Roles" />,
      'permissions': <GenericPage title="Permissions" />
    };

    if (componentMap[activeMenu]) {
      return componentMap[activeMenu];
    }

    const allMenuItems = Object.values(menuItems).flat();
    const allSubmenuItems = allMenuItems
      .filter(item => item.hasSubmenu)
      .flatMap(item => item.submenu);
    
    const currentMenuItem = allMenuItems.find(item => item.id === activeMenu) ||
                            allSubmenuItems.find(item => item.id === activeMenu);
    
    if (currentMenuItem) {
      return <GenericPage title={currentMenuItem.title} />;
    }

    return <GenericPage title="Page Not Found" />;
  };

  const MenuItem = ({ item, level = 0 }) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeMenu === item.id;

    return (
      <div className="mb-1">
        <div
          className={`d-flex align-items-center p-2 rounded cursor-pointer transition-all ${
            isActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
          } ${level > 0 ? 'ms-2 ms-md-3' : ''}`}
          onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
          style={{ 
            cursor: 'pointer', 
            paddingLeft: level > 0 ? '1.5rem' : '0.5rem',
            fontSize: '14px'
          }}
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
          <div className="ms-2 ms-md-3">
            {item.submenu.map(subItem => {
              const isSubActive = activeMenu === subItem.id;
              return (
                <div
                  key={subItem.id}
                  className={`d-flex align-items-center p-2 rounded cursor-pointer transition-all ms-2 ms-md-3 ${
                    isSubActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmenuClick(subItem.id);
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    paddingLeft: '1.5rem',
                    fontSize: '13px'
                  }}
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
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay d-md-none"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar bg-white shadow-lg ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''} ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
          {!isCollapsed && (
            <h6 className="mb-0 fw-bold text-primary text-truncate" style={{ fontSize: '14px' }}>
              {user.role.toUpperCase()} Panel
            </h6>
          )}
          <button
            className="btn btn-outline-secondary btn-sm d-none d-md-block"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm d-md-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu p-2">
          {currentMenuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile Top Bar */}
        <div className="mobile-topbar d-md-none bg-white shadow-sm p-3 d-flex align-items-center justify-content-between">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={18} />
          </button>
          <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: '14px' }}>
            {user.role.toUpperCase()} Panel
          </h6>
          <div style={{ width: '40px' }}></div>
        </div>

        {/* Content Container */}
        <div className="content-container">
          <div className="container-fluid p-3 p-md-4">
            {renderContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
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
          top: 0;
          left: 0;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          transition: all 0.3s ease;
          z-index: 1050;
        }

        .sidebar-expanded {
          width: 280px;
        }

        .sidebar-collapsed {
          width: 70px;
        }

        .sidebar-menu {
          max-height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .sidebar-collapsed ~ .main-content {
          margin-left: 70px;
        }

        .mobile-topbar {
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .content-container {
          padding-top: 0;
        }

        .cursor-pointer {
          cursor: pointer;
        }
        
        .hover-bg-light:hover {
          background: linear-gradient(135deg, #3fe2cd20, #ffffff70) !important;
          color: #2c5f5d !important;
          transform: translateX(2px);
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
          }

          .sidebar-mobile-open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0 !important;
          }

          .content-container {
            padding-top: 0;
          }
        }

        @media (min-width: 768px) and (max-width: 991.98px) {
          .sidebar-expanded {
            width: 240px;
          }

          .main-content {
            margin-left: 240px;
          }

          .sidebar-collapsed ~ .main-content {
            margin-left: 70px;
          }
        }

        @media (max-width: 575.98px) {
          .sidebar {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;