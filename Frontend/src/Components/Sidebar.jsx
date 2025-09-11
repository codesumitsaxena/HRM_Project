import React, { useState } from 'react';
import { 
  Home, Users, UserPlus, Calendar, DollarSign, Clock, 
  FileText, BarChart3, Settings, Shield, LogOut, 
  ChevronDown, ChevronRight, Menu, X 
} from 'lucide-react';
import EmployeeTable from '../Components/EmployeeTable'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin'); // admin, hr, employee, manager


  // Role-based menu configuration
  const menuItems = {
    admin: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Home,
        path: '/dashboard',
        component: 'Dashboard.js'
      },
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'AllEmployees.js' },
          { id: 'add-employee', title: 'Add Employee', path: '/employees/add', component: 'AddEmployee.js' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeProfiles.js' },
          { id: 'departments', title: 'Departments', path: '/departments', component: 'Departments.js' }
        ]
      },
      {
        id: 'recruitment',
        title: 'Recruitment',
        icon: UserPlus,
        hasSubmenu: true,
        submenu: [
          { id: 'job-postings', title: 'Job Postings', path: '/recruitment/jobs', component: 'JobPostings.js' },
          { id: 'applications', title: 'Applications', path: '/recruitment/applications', component: 'Applications.js' },
          { id: 'interviews', title: 'Interviews', path: '/recruitment/interviews', component: 'Interviews.js' }
        ]
      },
      {
        id: 'attendance',
        title: 'Attendance & Time',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance.js' },
          { id: 'monthly-report', title: 'Monthly Reports', path: '/attendance/monthly', component: 'MonthlyAttendance.js' },
          { id: 'leave-management', title: 'Leave Management', path: '/attendance/leaves', component: 'LeaveManagement.js' },
          { id: 'overtime', title: 'Overtime Tracking', path: '/attendance/overtime', component: 'OvertimeTracking.js' }
        ]
      },
      {
        id: 'payroll',
        title: 'Payroll Management',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'salary-structure', title: 'Salary Structure', path: '/payroll/structure', component: 'SalaryStructure.js' },
          { id: 'payroll-processing', title: 'Payroll Processing', path: '/payroll/processing', component: 'PayrollProcessing.js' },
          { id: 'payslips', title: 'Pay Slips', path: '/payroll/payslips', component: 'PaySlips.js' },
          { id: 'tax-management', title: 'Tax Management', path: '/payroll/tax', component: 'TaxManagement.js' }
        ]
      },
      {
        id: 'performance',
        title: 'Performance',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals.js' },
          { id: 'goals', title: 'Goals & KPIs', path: '/performance/goals', component: 'Goals.js' },
          { id: 'reviews', title: 'Performance Reviews', path: '/performance/reviews', component: 'PerformanceReviews.js' }
        ]
      },
      {
        id: 'reports',
        title: 'Reports & Analytics',
        icon: FileText,
        hasSubmenu: true,
        submenu: [
          { id: 'employee-reports', title: 'Employee Reports', path: '/reports/employees', component: 'EmployeeReports.js' },
          { id: 'attendance-reports', title: 'Attendance Reports', path: '/reports/attendance', component: 'AttendanceReports.js' },
          { id: 'payroll-reports', title: 'Payroll Reports', path: '/reports/payroll', component: 'PayrollReports.js' },
          { id: 'analytics', title: 'HR Analytics', path: '/reports/analytics', component: 'HRAnalytics.js' }
        ]
      },
      {
        id: 'settings',
        title: 'System Settings',
        icon: Settings,
        hasSubmenu: true,
        submenu: [
          { id: 'company-settings', title: 'Company Settings', path: '/settings/company', component: 'CompanySettings.js' },
          { id: 'user-roles', title: 'User Roles', path: '/settings/roles', component: 'UserRoles.js' },
          { id: 'permissions', title: 'Permissions', path: '/settings/permissions', component: 'Permissions.js' }
        ]
      }
    ],
    hr: [
      {
        id: 'dashboard',
        title: 'HR Dashboard',
        icon: Home,
        path: '/hr-dashboard',
        component: 'HRDashboard.js'
      },
      {
        id: 'employees',
        title: 'Employee Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'all-employees', title: 'All Employees', path: '/employees', component: 'AllEmployees.js' },
          { id: 'add-employee', title: 'Add Employee', path: '/employees/add', component: 'AddEmployee.js' },
          { id: 'employee-profiles', title: 'Employee Profiles', path: '/employees/profiles', component: 'EmployeeProfiles.js' }
        ]
      },
      {
        id: 'recruitment',
        title: 'Recruitment',
        icon: UserPlus,
        hasSubmenu: true,
        submenu: [
          { id: 'job-postings', title: 'Job Postings', path: '/recruitment/jobs', component: 'JobPostings.js' },
          { id: 'applications', title: 'Applications', path: '/recruitment/applications', component: 'Applications.js' },
          { id: 'interviews', title: 'Interviews', path: '/recruitment/interviews', component: 'Interviews.js' }
        ]
      },
      {
        id: 'attendance',
        title: 'Attendance Management',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'daily-attendance', title: 'Daily Attendance', path: '/attendance/daily', component: 'DailyAttendance.js' },
          { id: 'leave-requests', title: 'Leave Requests', path: '/attendance/leave-requests', component: 'LeaveRequests.js' }
        ]
      }
    ],
    manager: [
      {
        id: 'dashboard',
        title: 'Manager Dashboard',
        icon: Home,
        path: '/manager-dashboard',
        component: 'ManagerDashboard.js'
      },
      {
        id: 'team',
        title: 'Team Management',
        icon: Users,
        hasSubmenu: true,
        submenu: [
          { id: 'team-members', title: 'Team Members', path: '/team/members', component: 'TeamMembers.js' },
          { id: 'team-attendance', title: 'Team Attendance', path: '/team/attendance', component: 'TeamAttendance.js' }
        ]
      },
      {
        id: 'performance',
        title: 'Performance Management',
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          { id: 'team-performance', title: 'Team Performance', path: '/performance/team', component: 'TeamPerformance.js' },
          { id: 'appraisals', title: 'Appraisals', path: '/performance/appraisals', component: 'Appraisals.js' }
        ]
      }
    ],
    employee: [
      {
        id: 'dashboard',
        title: 'My Dashboard',
        icon: Home,
        path: '/employee-dashboard',
        component: 'EmployeeDashboard.js'
      },
      {
        id: 'profile',
        title: 'My Profile',
        icon: Users,
        path: '/profile',
        component: 'MyProfile.js'
      },
      {
        id: 'attendance',
        title: 'My Attendance',
        icon: Clock,
        hasSubmenu: true,
        submenu: [
          { id: 'check-in-out', title: 'Check In/Out', path: '/attendance/checkin', component: 'CheckInOut.js' },
          { id: 'my-attendance', title: 'Attendance History', path: '/attendance/history', component: 'AttendanceHistory.js' },
          { id: 'leave-request', title: 'Leave Request', path: '/attendance/leave-request', component: 'LeaveRequest.js' }
        ]
      },
      {
        id: 'payroll',
        title: 'My Payroll',
        icon: DollarSign,
        hasSubmenu: true,
        submenu: [
          { id: 'payslips', title: 'My Pay Slips', path: '/payroll/my-payslips', component: 'MyPaySlips.js' },
          { id: 'tax-documents', title: 'Tax Documents', path: '/payroll/tax-docs', component: 'TaxDocuments.js' }
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
            {item.submenu.map(subItem => (
              <MenuItem key={subItem.id} item={subItem} level={level + 1} />
            ))}
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
        className={`bg-white shadow-lg transition-all ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
        style={{
          width: isCollapsed ? '70px' : '280px',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
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

        {/* Role Selector (Demo) */}
        {!isCollapsed && (
          <div className="p-3 border-bottom">
            <label className="form-label small text-muted">Current Role:</label>
            <select
              className="form-select form-select-sm"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
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
        <div className="position-absolute bottom-0 w-100 p-2 border-top bg-light">
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
        <div className="container-fluid z-1">
          <div className="row">
            <div className="col-12">
              <EmployeeTable/>
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