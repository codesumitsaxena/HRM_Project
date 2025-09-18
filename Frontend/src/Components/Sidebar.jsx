import React, { useState } from 'react';
import { 
  Home, Users, UserPlus, Calendar, DollarSign, Clock, 
  FileText, BarChart3, Settings, Shield, LogOut, 
  ChevronDown, ChevronRight, Menu, X, Plus, UserCircle 
} from 'lucide-react';
import EmployeeTable from '../Components/EmployeeTable';
import DepartmentTable from '../Components/DepartmentTable'
import LeaveRequest from '../Components/LeaveRequest'
import AttendanceTable from '../Components/AttendanceEmployee'
const Dashboard = () => {
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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');

  // Role-based menu configuration
  const menuItems = {
    admin: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Home,
        path: '/dashboard',
        component: 'Dashboard'
      },
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        path: '/Employee',
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'add-employee', title: 'Add Employee', path: '/employees/add', component: 'EmployeeTable' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeTable' },
          { id: 'departments', title: 'Departments', path: '/Department', component: 'DepartmentTable' },
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
        title: 'Attendance & Time',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance' },
          { id: 'monthly-report', title: 'Monthly Reports', path: '/attendance/monthly', component: 'MonthlyAttendance' },
          { id: 'leave-management', title: 'Leave Management', path: '/attendance/leaves', component: 'LeaveRequest' },
          { id: 'overtime', title: 'Overtime Tracking', path: '/attendance/overtime', component: 'OvertimeTracking' }
        ]
      },
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
      {
        id: 'performance',
        title: 'Performance',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals' },
          { id: 'goals', title: 'Goals & KPIs', path: '/performance/goals', component: 'Goals' },
          { id: 'reviews', title: 'Performance Reviews', path: '/performance/reviews', component: 'PerformanceReviews' }
        ]
      },
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
      {
        id: 'dashboard',
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
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'EmployeeTable' },
          { id: 'add-employee', title: 'Add Employee', path: '/employees/add', component: 'EmployeeTable' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeTable' }
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
        title: 'Attendance Management',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance' },
          { id: 'leave-requests', title: 'Leave Requests', path: '/attendance/leave-requests', component: 'LeaveRequest' }
        ]
      }
    ],
    manager: [
      {
        id: 'dashboard',
        title: 'Manager Dashboard',
        icon: Home,
        path: '/manager-dashboard',
        component: 'ManagerDashboard'
      },
      {
        id: 'team',
        title: 'Team Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'team-members', title: 'Team Members', path: '/team/members', component: 'TeamMembers' },
          { id: 'team-attendance', title: 'Team Attendance', path: '/team/attendance', component: 'TeamAttendance' }
        ]
      },
      {
        id: 'performance',
        title: 'Performance Management',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'team-performance', title: 'Team Performance', path: '/performance/team', component: 'TeamPerformance' },
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals' }
        ]
      }
    ],
    employee: [
      {
        id: 'dashboard',
        title: 'My Dashboard',
        icon: Home,
        path: '/employee-dashboard',
        component: 'EmployeeDashboard'
      },
      {
        id: 'profile',
        title: 'My Profile',
        icon: Users,
        path: '/profile',
        component: 'MyProfile'
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

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    // Reset active menu to dashboard when role changes
    setActiveMenu('dashboard');
    // Close all expanded menus
    setExpandedMenus({});
  };

  const renderContent = () => {
    // Handle dashboard rendering for different roles
    if (activeMenu === 'dashboard') {
      return <Dashboard />;
    }

    // Handle Employee Management submenu items
    if (['all-employees', 'add-employee', 'employee-profiles'].includes(activeMenu)) {
      return <EmployeeTable />;

    }
    if(activeMenu === 'departments'){
      return <DepartmentTable/>
    }

    if(activeMenu === 'leave-request'){
      return <LeaveRequest/>
    }
    if(activeMenu === 'employee-attendance'){
      return <AttendanceTable/>
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

  const currentMenuItems = menuItems[userRole] || [];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`bg-white mt-5 pt-4 shadow-lg transition-all ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
        style={{
          width: isCollapsed ? '70px' : '280px',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '94vh',
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          {!isCollapsed && (
            <h5 className="mb-0 fw-bold text-primary">HRM System</h5>
          )}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Role Selector */}
        {!isCollapsed && (
          <div className="p-3 border-bottom">
            <label className="form-label small text-muted">Current Role:</label>
            <select
              className="form-select form-select-sm"
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="hr">HR Manager</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        )}

        {/* Menu Items */}
        <div className="p-2">
          {currentMenuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>

        {/* Logout */}
        <div className="position-absolute bottom- w-100 p-2 border-top bg-light">
          <div className="d-flex align-items-center p-2 text-danger cursor-pointer hover-bg-light rounded">
            <LogOut size={18} className="me-2" />
            {!isCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: isCollapsed ? '70px' : '280px',
          transition: 'margin-left 0.3s ease',
          padding: '20px'
        }}
      >
        <div className="container-fluid mt-5 pt-4">
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

export default Sidebar;