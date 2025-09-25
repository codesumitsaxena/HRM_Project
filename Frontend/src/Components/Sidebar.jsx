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

const DashboardHome = () => {
  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total Employees</h5>
              <h2>156</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Present Today</h5>
              <h2>142</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>On Leave</h5>
              <h2>14</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>New Hires</h5>
              <h2>8</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded shadow-sm p-4">
        <h4>Dashboard Overview</h4>
        <p>Welcome to the HRM System Dashboard. Here you can view all the important metrics and information.</p>
      </div>
    </div>
  );
};

const GenericPage = ({ title }) => {
  return (
    <div className="bg-white rounded shadow-sm p-4">
      <h4>{title}</h4>
      <p>This is the {title.toLowerCase()} page. Content will be implemented here.</p>
      <div className="alert alert-info">
        <strong>Coming Soon!</strong> This feature is under development.
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const { user, logout, isAdmin, isHR, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set active menu based on current route or user role
  useEffect(() => {
    if (user) {
      // Determine initial active menu based on user role
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

  // Role-based menu configuration with hierarchical access
  const menuItems = {
    admin: [
      // Admin Dashboard
      {
        id: 'adminDashboard',
        title: 'Admin Dashboard',
        icon: Home,
        path: '/adminDashboard',
        component: 'AdminDashboard'
      },
      
      // Admin can access all other role dashboards
      {
        id: 'role-dashboards',
        title: 'Role Dashboards',
        icon: Shield,
        hasSubmenu: true,
        submenu: [
          { id: 'HRdashboard', title: 'HR Dashboard', path: '/hr-dashboard', component: 'HRDashboard' },
          { id: 'managerDashboard', title: 'Manager Dashboard', path: '/manager-dashboard', component: 'ManagerDashboard' },
          { id: 'employee-dashboard', title: 'Employee Dashboard', path: '/employee-dashboard', component: 'EmployeeDashboard' }
        ]
      },

      // Employee Management (Admin has full access)
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        path: '/Employee',
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeTable' },
          { id: 'departments', title: 'Departments', path: '/Department', component: 'DepartmentTable' },
          { id: 'employee-profile', title: 'Individual Profile View', path: '/employee-profile', component: 'EmployeeProfile' }
        ]
      },
      
      // Recruitment (Admin + HR level access)
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
      
      // Attendance & Leave Management (All levels)
      {
        id: 'attendance',
        title: 'Attendance & Leave Management',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance' },
          { id: 'monthly-report', title: 'Monthly Reports', path: '/attendance/monthly', component: 'MonthlyAttendance' },
          { id: 'admin-leave-management', title: 'Admin Leave Management', path: '/admin/attendance/leaves', component: 'AdminLeaveManagement' },
          { id: 'hr-leave-requests', title: 'HR Leave Requests', path: '/hr-leave-requests', component: 'HRleaveRequest' },
          { id: 'leave-request', title: 'Employee Leave Request', path: '/attendance/leave-request', component: 'LeaveRequest' },
          { id: 'employee-attendance', title: 'Employee Attendance History', path: '/employee-attendance', component: 'AttendanceTable' },
          { id: 'overtime', title: 'Overtime Tracking', path: '/attendance/overtime', component: 'OvertimeTracking' }
        ]
      },
      
      // Payroll Management
      {
        id: 'payroll',
        title: 'Payroll Management',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'salary-structure', title: 'Salary Structure', path: '/payroll/structure', component: 'SalaryStructure' },
          { id: 'payroll-processing', title: 'Payroll Processing', path: '/payroll/processing', component: 'PayrollProcessing' },
          { id: 'payslips', title: 'Pay Slips', path: '/payroll/payslips', component: 'PaySlips' },
          { id: 'tax-management', title: 'Tax Management', path: '/payroll/tax', component: 'TaxManagement' }
        ]
      },
      
      // Performance Management
      {
        id: 'performance',
        title: 'Performance Management',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals' },
          { id: 'goals', title: 'Goals & KPIs', path: '/performance/goals', component: 'Goals' },
          { id: 'reviews', title: 'Performance Reviews', path: '/performance/reviews', component: 'PerformanceReviews' },
          { id: 'team-performance', title: 'Team Performance', path: '/performance/team', component: 'TeamPerformance' }
        ]
      },
      
      // Reports & Analytics
      {
        id: 'reports',
        title: 'Reports & Analytics',
        icon: FileText,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports', path: '/reports/employees', component: 'EmployeeReports' },
          { id: 'attendance-reports', title: 'Attendance Reports', path: '/reports/attendance', component: 'AttendanceReports' },
          { id: 'payroll-reports', title: 'Payroll Reports', path: '/reports/payroll', component: 'PayrollReports' },
          { id: 'analytics', title: 'HR Analytics', path: '/reports/analytics', component: 'HRAnalytics' }
        ]
      },
      
      // System Settings (Admin only)
      {
        id: 'settings',
        title: 'System Settings',
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
      // HR Dashboard (HR's main dashboard)
      {
        id: 'HRdashboard',
        title: 'HR Dashboard',
        icon: Home,
        path: '/hr-dashboard',
        component: 'HRDashboard'
      },
      
      // HR can access employee role dashboard
      {
        id: 'role-access',
        title: 'Role Access',
        icon: Shield,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-dashboard', title: 'Employee Dashboard', path: '/employee-dashboard', component: 'EmployeeDashboard' },
          { id: 'managerDashboard', title: 'Manager Dashboard', path: '/manager-dashboard', component: 'ManagerDashboard' }
        ]
      },
      
      // Employee Management (HR level access)
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeTable' },
          { id: 'employee-profile', title: 'Individual Profile View', path: '/employee-profile', component: 'EmployeeProfile' }
        ]
      },
      
      // Recruitment (HR responsibility)
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
      
      // Attendance Management (HR can see all)
      {
        id: 'attendance',
        title: 'Attendance Management',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance' },
          { id: 'hr-leave-requests', title: 'Leave Requests', path: '/hr-leave-requests', component: 'HRleaveRequest' },
          { id: 'employee-attendance', title: 'Employee Attendance History', path: '/employee-attendance', component: 'AttendanceTable' },
          { id: 'leave-request', title: 'Employee Leave Request View', path: '/attendance/leave-request', component: 'LeaveRequest' }
        ]
      },
      
      // Basic Reports
      {
        id: 'reports',
        title: 'HR Reports',
        icon: FileText,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports', path: '/reports/employees', component: 'EmployeeReports' },
          { id: 'attendance-reports', title: 'Attendance Reports', path: '/reports/attendance', component: 'AttendanceReports' }
        ]
      }
    ],
    manager: [
      // Manager Dashboard
      {
        id: 'managerDashboard',
        title: 'Manager Dashboard',
        icon: Home,
        path: '/manager-dashboard',
        component: 'ManagerDashboard'
      },
      
      // Manager can access employee dashboard
      {
        id: 'role-access',
        title: 'Team Access',
        icon: Shield,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-dashboard', title: 'Employee Dashboard', path: '/employee-dashboard', component: 'EmployeeDashboard' }
        ]
      },
      
      // Team Management
      {
        id: 'team',
        title: 'Team Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'team-members', title: 'Team Members', path: '/team/members', component: 'TeamMembers' },
          { id: 'team-attendance', title: 'Team Attendance', path: '/team/attendance', component: 'TeamAttendance' },
          { id: 'all-employees', title: 'View All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'employee-profile', title: 'Employee Profile View', path: '/employee-profile', component: 'EmployeeProfile' }
        ]
      },
      
      // Performance Management
      {
        id: 'performance',
        title: 'Performance Management',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'team-performance', title: 'Team Performance', path: '/performance/team', component: 'TeamPerformance' },
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals' }
        ]
      },
      
      // Leave Management
      {
        id: 'leave-management',
        title: 'Leave Management',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'team-leave-requests', title: 'Team Leave Requests', path: '/manager/leave-requests', component: 'ManagerLeaveRequests' },
          { id: 'employee-attendance', title: 'Employee Attendance', path: '/employee-attendance', component: 'AttendanceTable' }
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
          { id: 'employee-attendance', title: 'Attendance History', path: '/employee-attendance', component: 'AttendanceTable' },
          { id: 'leave-request', title: 'Leave Request', path: '/attendance/leave-request', component: 'LeaveRequest' }
        ]
      },
      {
        id: 'payroll',
        title: 'My Payroll',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'payslips', title: 'My Pay Slips', path: '/payroll/my-payslips', component: 'MyPaySlips' },
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
    }
  };

  const handleSubmenuClick = (submenuId) => {
    setActiveMenu(submenuId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    // Handle dashboard rendering for different roles
    if (activeMenu === 'dashboard') {
      return <DashboardHome />;
    }

    // Map active menu to components
    const componentMap = {
      // Main Dashboards
      'adminDashboard': <AdminDashboard />,
      'HRdashboard': <HRLeaveDashboard />,
      'managerDashboard': <GenericPage title="Manager Dashboard" />,
      'employee-dashboard': <EmployeeDashboard />,
      
      // Employee Management
      'employee-profile': <EmployeeProfile />,
      'all-employees': <EmployeeTable />,
      'employee-profiles': <EmployeeTable />,
      'departments': <DepartmentTable />,
      
      // Attendance & Leave
      'leave-request': <LeaveRequest />,
      'employee-attendance': <AttendanceTable />,
      'hr-leave-requests': <HRleaveRequest />,
      'admin-leave-management': <AdminLeaveManagement />,
      
      // Generic pages for features under development
      'daily-attendance': <GenericPage title="Daily Attendance" />,
      'monthly-report': <GenericPage title="Monthly Reports" />,
      'overtime': <GenericPage title="Overtime Tracking" />,
      
      // Recruitment
      'job-postings': <GenericPage title="Job Postings" />,
      'applications': <GenericPage title="Applications" />,
      'interviews': <GenericPage title="Interviews" />,
      
      // Payroll
      'salary-structure': <GenericPage title="Salary Structure" />,
      'payroll-processing': <GenericPage title="Payroll Processing" />,
      'payslips': <GenericPage title="Pay Slips" />,
      'tax-management': <GenericPage title="Tax Management" />,
      
      // Performance
      'appraisals': <GenericPage title="Appraisals" />,
      'goals': <GenericPage title="Goals & KPIs" />,
      'reviews': <GenericPage title="Performance Reviews" />,
      'team-performance': <GenericPage title="Team Performance" />,
      
      // Team Management
      'team-members': <GenericPage title="Team Members" />,
      'team-attendance': <GenericPage title="Team Attendance" />,
      
      // Reports
      'employee-reports': <GenericPage title="Employee Reports" />,
      'attendance-reports': <GenericPage title="Attendance Reports" />,
      'payroll-reports': <GenericPage title="Payroll Reports" />,
      'analytics': <GenericPage title="HR Analytics" />,
      
      // Settings
      'company-settings': <GenericPage title="Company Settings" />,
      'user-roles': <GenericPage title="User Roles" />,
      'permissions': <GenericPage title="Permissions" />
    };

    // Return specific component or generic page
    if (componentMap[activeMenu]) {
      return componentMap[activeMenu];
    }

    // For other menu items, show generic page
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
          } ${level > 0 ? 'ms-3' : ''}`}
          onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
          style={{ cursor: 'pointer', paddingLeft: level > 0 ? '2rem' : '0.5rem' }}
        >
          {Icon && <Icon size={18} className="me-2" />}
          {!isCollapsed && (
            <>
              <span className="flex-grow-1">{item.title}</span>
              {item.hasSubmenu && (
                isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
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
                  className={`d-flex align-items-center p-2 rounded cursor-pointer transition-all ms-3 ${
                    isSubActive ? 'bg-primary text-white' : 'text-secondary hover-bg-light'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmenuClick(subItem.id);
                  }}
                  style={{ cursor: 'pointer', paddingLeft: '2rem' }}
                >
                  <span>{subItem.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Get menu items based on user role
  const currentMenuItems = user ? (menuItems[user.role] || []) : [];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Top Navbar */}
     
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
        style={{
          width: isCollapsed ? '70px' : '280px',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
          paddingTop: '76px' // Account for fixed navbar
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          {!isCollapsed && (
            <h6 className="mb-0 fw-bold text-primary">{user.role.toUpperCase()} Panel</h6>
          )}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {currentMenuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: isCollapsed ? '70px' : '280px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          paddingTop: '96px' // Account for fixed navbar
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .hover-bg-light:hover {
          background: linear-gradient(135deg, #3fe2cd20, #ffffff70) !important;
          color: #2c5f5d !important;
          transform: translateX(3px);
        }
        
        .transition-all {
          transition: all 0.2s ease;
        }
        
        @media (max-width: 768px) {
          .sidebar-expanded {
            width: 100% !important;
            position: fixed !important;
            z-index: 1050 !important;
          }
          
          .sidebar-collapsed {
            width: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;