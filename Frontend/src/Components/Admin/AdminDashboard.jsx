import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, BarChart3, TrendingUp, Clock, 
  AlertCircle, CheckCircle, XCircle, Building2, Shield,
  Eye, CheckSquare, X, RefreshCw, Bell, Home, Briefcase
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [newJoinees, setNewJoinees] = useState([]);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    newJoinees: 0,
    totalDepartments: 0
  });

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      const employeesData = Array.isArray(data) ? data : data.employees || [];
      setEmployees(employeesData);
      
      // Calculate new joiners (joined in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newEmps = employeesData.filter(emp => {
        if (!emp.Date_of_Joining) return false;
        const joinDate = new Date(emp.Date_of_Joining);
        return joinDate >= thirtyDaysAgo;
      }).map(emp => ({
        ...emp,
        daysAgo: Math.floor((new Date() - new Date(emp.Date_of_Joining)) / (1000 * 60 * 60 * 24))
      }));
      
      setNewJoinees(newEmps);
      
      return employeesData;
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
      setNewJoinees([]);
      return [];
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/departments", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      const deptData = Array.isArray(data) ? data : [];
      setDepartments(deptData);
      return deptData;
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
      return [];
    }
  };

  // Fetch Leave Requests
  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/hr-leaves", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leave requests');
      const data = await response.json();
      const leaveData = Array.isArray(data) ? data : data.leaveRequests || [];
      setLeaveRequests(leaveData);
      
      // Filter employees currently on approved leave
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const onLeave = leaveData.filter(leave => {
        if (leave.Status !== 'Approved') return false;
        const startDate = new Date(leave.Start_Date);
        const endDate = new Date(leave.End_Date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      });
      
      setEmployeesOnLeave(onLeave);
      updateLeaveStats(leaveData);
      
      return leaveData;
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setLeaveRequests([]);
      setEmployeesOnLeave([]);
      return [];
    }
  };

  // Fetch Attendance
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:3000/attendance?date=${today}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const attendanceData = Array.isArray(data) ? data : data.attendance || [];
        setAttendanceRecords(attendanceData);
        return attendanceData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };

  // Update Leave Stats
  const updateLeaveStats = (requests) => {
    const pendingCount = requests.filter(r => r.Status === 'Pending').length;
    const approvedCount = requests.filter(r => r.Status === 'Approved').length;
    const rejectedCount = requests.filter(r => r.Status === 'Rejected').length;
    
    setStats(prevStats => ({
      ...prevStats,
      pendingRequests: pendingCount,
      approvedLeaves: approvedCount,
      rejectedLeaves: rejectedCount
    }));
  };

  // Refresh All Data
  const refreshAllData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    try {
      const [employeesData, deptData, leaveData, attendanceData] = await Promise.all([
        fetchEmployees(),
        fetchDepartments(),
        fetchLeaveRequests(),
        fetchAttendance()
      ]);

      const presentCount = attendanceData.filter(a => a.status === 'Present').length;
      const onLeaveCount = leaveData.filter(leave => {
        if (leave.Status !== 'Approved') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(leave.Start_Date);
        const endDate = new Date(leave.End_Date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      }).length;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newJoinersCount = employeesData.filter(emp => {
        if (!emp.Date_of_Joining) return false;
        const joinDate = new Date(emp.Date_of_Joining);
        return joinDate >= thirtyDaysAgo;
      }).length;
      
      setStats(prevStats => ({
        ...prevStats,
        totalEmployees: employeesData.length,
        presentToday: presentCount,
        onLeave: onLeaveCount,
        totalDepartments: deptData.length,
        newJoinees: newJoinersCount
      }));

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Approve/Reject Leave
  const handleLeaveAction = async (leave, action) => {
    const actionText = action === 'Approved' ? 'approve' : 'reject';
    let comments = '';
    
    if (action === 'Rejected') {
      comments = prompt('Please provide a reason for rejection:');
      if (!comments) return;
    } else {
      if (!window.confirm(`Are you sure you want to ${actionText} this leave request?`)) {
        return;
      }
      comments = 'Approved by Admin';
    }

    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem("token");
      const leaveId = leave.Leave_Id || leave._id;
      
      const response = await fetch(`http://localhost:3000/hr-leaves/${leaveId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action,
          comments: comments
            
        }),
      });

      if (response.ok) {
        setSuccess(`Leave ${actionText}ed successfully!`);
        await refreshAllData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${actionText} leave`);
      }
    } catch (error) {
      console.error(`Error ${actionText}ing leave:`, error);
      setError(`Error ${actionText}ing leave: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Utility Functions
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.Employee_Id === employeeId);
    return employee ? `${employee.First_Name} ${employee.Last_Name}` : `Employee ${employeeId}`;
  };

  const getDepartmentName = (employeeId) => {
    const employee = employees.find(emp => emp.Employee_Id === employeeId);
    if (!employee) return 'N/A';
    const dept = departments.find(d => d.Dept_Id === employee.Dept_Id);
    return dept ? dept.Department_Name : 'N/A';
  };

  const calculateLeaveDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getRemainingLeaveDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'linear-gradient(45deg, #28a745, #20c997)';
      case 'Rejected':
        return 'linear-gradient(45deg, #dc3545, #c82333)';
      default:
        return 'linear-gradient(45deg, #ffc107, #fd7e14)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle size={14} />;
      case 'Rejected':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  // Header Component
  const Header = () => (
    <div 
      className="card mb-4"
      style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(63, 226, 205, 0.1)"
      }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <Shield size={24} className="me-2" style={{ color: "#2c5f5d" }} />
            <div>
              <h4 className="mb-0" style={{ color: "#2c5f5d" }}>Admin Dashboard</h4>
              <small style={{ color: "#5a6c6b" }}>System Overview & Management</small>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="d-flex align-items-center mb-1">
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isLoading ? '#ffc107' : '#28a745',
                    animation: isLoading ? 'pulse 1.5s infinite' : 'none',
                    marginRight: '8px'
                  }}
                ></div>
                <small style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>
                  {isLoading ? 'Updating...' : 'Live Data'}
                </small>
              </div>
              <small style={{ color: "#5a6c6b", fontSize: "0.7rem" }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </small>
            </div>
            
            <button 
              className="btn btn-sm"
              onClick={refreshAllData}
              disabled={isLoading}
              style={{
                background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px"
              }}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                <RefreshCw size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );

  // Navigation
  const Navigation = () => (
    <div 
      className="card mb-4"
      style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px"
      }}
    >
      <div className="card-body">
        <div className="d-flex flex-wrap gap-2">
          {['dashboard', 'leaves', 'onleave', 'newjoiners'].map(module => (
            <button 
              key={module}
              className={`btn ${activeModule === module ? 'active' : ''}`}
              style={{
                background: activeModule === module 
                  ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                  : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                color: activeModule === module ? "white" : "#2c5f5d",
                border: "1px solid rgba(63, 226, 205, 0.3)",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "0.875rem"
              }}
              onClick={() => setActiveModule(module)}
            >
              {module === 'dashboard' && <><Home size={16} className="me-1" />Dashboard</>}
              {module === 'leaves' && (
                <>
                  <Calendar size={16} className="me-1" />
                  Leave Requests
                  {stats.pendingRequests > 0 && (
                    <span className="badge ms-2" style={{background: "#dc3545", borderRadius: "10px", fontSize: "0.7rem"}}>
                      {stats.pendingRequests}
                    </span>
                  )}
                </>
              )}
              {module === 'onleave' && <><Users size={16} className="me-1" />On Leave</>}
              {module === 'newjoiners' && <><Briefcase size={16} className="me-1" />New Joiners</>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Dashboard Overview
  const DashboardOverview = () => (
    <>
      {/* Alerts */}
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4" style={{borderRadius: "8px"}}>
          <CheckCircle size={20} className="me-2" />{success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" style={{borderRadius: "8px"}}>
          <AlertCircle size={20} className="me-2" />{error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        {[
          { icon: Users, value: stats.totalEmployees, label: 'Total Employees', color: '#3fe2cd' },
          { icon: Clock, value: stats.pendingRequests, label: 'Pending Requests', color: '#ffc107' },
          { icon: CheckCircle, value: stats.presentToday, label: 'Present Today', color: '#28a745' },
          { icon: Calendar, value: stats.onLeave, label: 'On Leave', color: '#dc3545' },
          { icon: Briefcase, value: stats.newJoinees, label: 'New Joiners (30d)', color: '#17a2b8' },
          { icon: Building2, value: stats.totalDepartments, label: 'Departments', color: '#6f42c1' }
        ].map((stat, idx) => (
          <div key={idx} className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div className="card h-100" style={{
              background: `linear-gradient(135deg, #ffffff90, ${stat.color}15)`,
              border: `1px solid ${stat.color}30`,
              borderRadius: "12px"
            }}>
              <div className="card-body text-center p-3">
                <stat.icon size={28} className="mb-2" style={{ color: stat.color }} />
                <h3 className="mb-1" style={{ color: stat.color }}>{stat.value}</h3>
                <small style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>{stat.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Pending Leave Requests */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100" style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "12px"
          }}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{ 
              background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
              border: "none",
              borderRadius: "11px 11px 0 0"
            }}>
              <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                <AlertCircle size={16} className="me-2" />Pending Leave Requests
              </h6>
              <span className="badge" style={{ 
                background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                color: "white",
                borderRadius: "12px"
              }}>
                {stats.pendingRequests}
              </span>
            </div>
            <div className="card-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {leaveRequests.filter(r => r.Status === 'Pending').slice(0, 5).map((request, index) => (
                <div key={request.Leave_Id || index} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ 
                  background: "#f8f9fa", 
                  borderRadius: "8px",
                  border: "1px solid rgba(63, 226, 205, 0.1)"
                }}>
                  <div style={{flex: 1}}>
                    <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                      {getEmployeeName(request.Employee_Id)}
                    </div>
                    <small style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>
                      {calculateLeaveDays(request.Start_Date, request.End_Date)} days • {getDepartmentName(request.Employee_Id)}
                    </small>
                  </div>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-sm"
                      style={{
                        background: "linear-gradient(45deg, #28a745, #20c997)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px"
                      }}
                      onClick={() => handleLeaveAction(request, 'Approved')}
                      disabled={saving}
                      title="Approve"
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button 
                      className="btn btn-sm"
                      style={{
                        background: "linear-gradient(45deg, #dc3545, #c82333)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px"
                      }}
                      onClick={() => handleLeaveAction(request, 'Rejected')}
                      disabled={saving}
                      title="Reject"
                    >
                      <X size={14} />
                    </button>
                    <button 
                      className="btn btn-sm"
                      style={{
                        background: "linear-gradient(45deg, #17a2b8, #20c997)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px"
                      }}
                      onClick={() => {
                        setViewingRequest(request);
                        setShowViewModal(true);
                      }}
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {leaveRequests.filter(r => r.Status === 'Pending').length === 0 && (
                <p className="text-center text-muted mb-0">No pending requests</p>
              )}
              <button 
                className="btn btn-sm w-100 mt-2"
                style={{
                  background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={() => setActiveModule('leaves')}
              >
                View All ({leaveRequests.length})
              </button>
            </div>
          </div>
        </div>

        {/* Employees On Leave */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100" style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "12px"
          }}>
            <div className="card-header" style={{ 
              background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
              border: "none",
              borderRadius: "11px 11px 0 0"
            }}>
              <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                <Users size={16} className="me-2" />Employees On Leave Today
              </h6>
            </div>
            <div className="card-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {employeesOnLeave.slice(0, 5).map((leave, index) => (
                <div key={leave.Leave_Id || index} className="mb-2 p-2" style={{ 
                  background: "#f8f9fa", 
                  borderRadius: "8px",
                  border: "1px solid rgba(63, 226, 205, 0.1)"
                }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                        {getEmployeeName(leave.Employee_Id)}
                      </div>
                      <small style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>
                        <Building2 size={12} className="me-1" />
                        {getDepartmentName(leave.Employee_Id)}
                      </small>
                      <div style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>
                        {getRemainingLeaveDays(leave.End_Date)} days remaining
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: "linear-gradient(45deg, #28a745, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.7rem"
                    }}>
                      On Leave
                    </span>
                  </div>
                </div>
              ))}
              {employeesOnLeave.length === 0 && (
                <p className="text-center text-muted mb-0">No employees on leave</p>
              )}
              <button 
                className="btn btn-sm w-100 mt-2"
                style={{
                  background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={() => setActiveModule('onleave')}
              >
                View All ({employeesOnLeave.length})
              </button>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className="col-12">
          <div className="card" style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "12px"
          }}>
            <div className="card-header" style={{ 
              background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
              border: "none",
              borderRadius: "11px 11px 0 0"
            }}>
              <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                <Building2 size={16} className="me-2" />Department Employee Distribution
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                {departments.map((dept, index) => (
                  <div key={dept.Dept_Id || index} className="col-lg-2 col-md-4 col-sm-6 mb-3">
                    <div className="text-center p-3" style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid rgba(63, 226, 205, 0.1)"
                    }}>
                      <Building2 size={24} className="mb-2" style={{ color: "#3fe2cd" }} />
                      <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                        {dept.Department_Name}
                      </div>
                      <div style={{ color: "#5a6c6b", fontSize: "0.75rem" }}>
                        <Users size={12} className="me-1" />
                        {dept.Total_Employee || 0} employees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {departments.length === 0 && (
                <p className="text-center text-muted mb-0">No departments found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Leave Requests Module
  const LeaveRequestsModule = () => (
    <>
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <CheckCircle size={20} className="me-2" />{success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <AlertCircle size={20} className="me-2" />{error}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: "#2c5f5d" }}>
          <Calendar size={20} className="me-2" />All Leave Requests
        </h5>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <div className="card h-100" style={{
            background: "linear-gradient(135deg, #ffffff90, #ffc10715)",
            border: "1px solid rgba(255, 193, 7, 0.2)",
            borderRadius: "8px"
          }}>
            <div className="card-body text-center p-3">
              <h4 style={{ color: "#ffc107" }}>{stats.pendingRequests}</h4>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card h-100" style={{
            background: "linear-gradient(135deg, #ffffff90, #28a74515)",
            border: "1px solid rgba(40, 167, 69, 0.2)",
            borderRadius: "8px"
          }}>
            <div className="card-body text-center p-3">
              <h4 style={{ color: "#28a745" }}>{stats.approvedLeaves}</h4>
              <small>Approved</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card h-100" style={{
            background: "linear-gradient(135deg, #ffffff90, #dc354515)",
            border: "1px solid rgba(220, 53, 69, 0.2)",
            borderRadius: "8px"
          }}>
            <div className="card-body text-center p-3">
              <h4 style={{ color: "#dc3545" }}>{stats.rejectedLeaves}</h4>
              <small>Rejected</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px"
      }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)" }}>
                <tr>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Department</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave Period</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Days</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
                  <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request, index) => (
                  <tr key={request.Leave_Id || index} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                    <td className="px-4 py-3">
                      <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                        {getEmployeeName(request.Employee_Id)}
                      </div>
                      <small style={{ color: "#5a6c6b" }}>ID: {request.Employee_Id}</small>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>
                      {getDepartmentName(request.Employee_Id)}
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                        <div>{new Date(request.Start_Date).toLocaleDateString()}</div>
                        <div>to {new Date(request.End_Date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                      {calculateLeaveDays(request.Start_Date, request.End_Date)} days
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge px-3 py-2" style={{ 
                        background: getStatusColor(request.Status),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.75rem"
                      }}>
                        {getStatusIcon(request.Status)} {request.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <button 
                          className="btn btn-sm"
                          style={{
                            background: "linear-gradient(45deg, #17a2b8, #20c997)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            width: "32px",
                            height: "32px"
                          }}
                          onClick={() => {
                            setViewingRequest(request);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        {request.Status === 'Pending' && (
                          <>
                            <button 
                              className="btn btn-sm"
                              style={{
                                background: "linear-gradient(45deg, #28a745, #20c997)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                width: "32px",
                                height: "32px"
                              }}
                              onClick={() => handleLeaveAction(request, 'Approved')}
                              disabled={saving}
                            >
                              <CheckSquare size={14} />
                            </button>
                            <button 
                              className="btn btn-sm"
                              style={{
                                background: "linear-gradient(45deg, #dc3545, #c82333)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                width: "32px",
                                height: "32px"
                              }}
                              onClick={() => handleLeaveAction(request, 'Rejected')}
                              disabled={saving}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {leaveRequests.length === 0 && !isLoading && (
        <div className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No leave requests found</h5>
        </div>
      )}
    </>
  );

  // Employees On Leave Module
  const EmployeesOnLeaveModule = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: "#2c5f5d" }}>
          <Users size={20} className="me-2" />Employees Currently On Leave
        </h5>
      </div>

      <div className="row">
        {employeesOnLeave.map((leave, index) => {
          const remainingDays = getRemainingLeaveDays(leave.End_Date);
          return (
            <div key={leave.Leave_Id || index} className="col-lg-4 col-md-6 mb-3">
              <div className="card h-100" style={{
                background: "linear-gradient(135deg, #ffffff95, #3fe2cd20)",
                border: "1px solid rgba(63, 226, 205, 0.3)",
                borderRadius: "12px"
              }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: "#2c5f5d" }}>
                        {getEmployeeName(leave.Employee_Id)}
                      </h6>
                      <small style={{ color: "#5a6c6b" }}>
                        <Building2 size={12} className="me-1" />
                        {getDepartmentName(leave.Employee_Id)}
                      </small>
                    </div>
                    <span className="badge" style={{
                      background: "linear-gradient(45deg, #28a745, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.7rem"
                    }}>
                      On Leave
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <small style={{ color: "#5a6c6b" }}>Leave Period:</small>
                    <div style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                      {new Date(leave.Start_Date).toLocaleDateString()} - {new Date(leave.End_Date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <small style={{ color: "#5a6c6b" }}>Total Days:</small>
                    <div style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                      {calculateLeaveDays(leave.Start_Date, leave.End_Date)} days
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <small style={{ color: "#5a6c6b" }}>Remaining:</small>
                    <div className="d-flex align-items-center">
                      <Clock size={14} className="me-1" style={{ color: "#ffc107" }} />
                      <span style={{ color: "#ffc107", fontSize: "0.875rem", fontWeight: "bold" }}>
                        {remainingDays} {remainingDays === 1 ? 'day' : 'days'} left
                      </span>
                    </div>
                  </div>

                  {leave.Reason && (
                    <div className="mb-3">
                      <small style={{ color: "#5a6c6b" }}>Reason:</small>
                      <div className="p-2 mt-1" style={{ 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#5a6c6b"
                      }}>
                        {leave.Reason.length > 80 ? leave.Reason.substring(0, 80) + '...' : leave.Reason}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-sm w-100"
                    style={{
                      background: "linear-gradient(45deg, #17a2b8, #20c997)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px"
                    }}
                    onClick={() => {
                      setViewingRequest(leave);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye size={14} className="me-1" />View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {employeesOnLeave.length === 0 && !isLoading && (
        <div className="card text-center py-5" style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px"
        }}>
          <div className="card-body">
            <Users size={48} style={{ color: "#3fe2cd" }} />
            <h5 className="mt-3" style={{ color: "#2c5f5d" }}>No Employees On Leave</h5>
            <p className="text-muted">All employees are currently present</p>
          </div>
        </div>
      )}
    </>
  );

  // New Joiners Module
  const NewJoinersModule = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: "#2c5f5d" }}>
          <Briefcase size={20} className="me-2" />New Employees (Last 30 Days)
        </h5>
      </div>

      <div className="row">
        {newJoinees.map((employee, index) => (
          <div key={employee.Employee_Id || index} className="col-lg-4 col-md-6 mb-3">
            <div className="card h-100" style={{
              background: "linear-gradient(135deg, #ffffff95, #17a2b820)",
              border: "1px solid rgba(23, 162, 184, 0.3)",
              borderRadius: "12px"
            }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: "#2c5f5d" }}>
                      {employee.First_Name} {employee.Last_Name}
                    </h6>
                    <small style={{ color: "#5a6c6b" }}>
                      ID: {employee.Employee_Id}
                    </small>
                  </div>
                  <span className="badge" style={{
                    background: "linear-gradient(45deg, #17a2b8, #20c997)",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "0.7rem"
                  }}>
                    New
                  </span>
                </div>
                
                <div className="mb-2">
                  <small style={{ color: "#5a6c6b" }}>Department:</small>
                  <div style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                    <Building2 size={12} className="me-1" />
                    {getDepartmentName(employee.Employee_Id)}
                  </div>
                </div>
                
                <div className="mb-2">
                  <small style={{ color: "#5a6c6b" }}>Position:</small>
                  <div style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                    {employee.Position || 'N/A'}
                  </div>
                </div>
                
                <div className="mb-2">
                  <small style={{ color: "#5a6c6b" }}>Join Date:</small>
                  <div style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                    {new Date(employee.Date_of_Joining).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mb-3">
                  <small style={{ color: "#5a6c6b" }}>Days with company:</small>
                  <div className="d-flex align-items-center">
                    <Clock size={14} className="me-1" style={{ color: "#17a2b8" }} />
                    <span style={{ color: "#17a2b8", fontSize: "0.875rem", fontWeight: "bold" }}>
                      {employee.daysAgo} days
                    </span>
                  </div>
                </div>

                {employee.Email && (
                  <div className="mb-2">
                    <small style={{ color: "#5a6c6b" }}>Email:</small>
                    <div style={{ color: "#2c5f5d", fontSize: "0.75rem" }}>
                      {employee.Email}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {newJoinees.length === 0 && !isLoading && (
        <div className="card text-center py-5" style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px"
        }}>
          <div className="card-body">
            <Briefcase size={48} style={{ color: "#3fe2cd" }} />
            <h5 className="mt-3" style={{ color: "#2c5f5d" }}>No New Joiners</h5>
            <p className="text-muted">No employees joined in the last 30 days</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="p-4" style={{
      background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
      minHeight: "100vh"
    }}>
      <Header />
      <Navigation />

      {activeModule === 'dashboard' && <DashboardOverview />}
      {activeModule === 'leaves' && <LeaveRequestsModule />}
      {activeModule === 'onleave' && <EmployeesOnLeaveModule />}
      {activeModule === 'newjoiners' && <NewJoinersModule />}

      {/* View Modal */}
      {showViewModal && viewingRequest && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1050
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{
              background: "#ffffff",
              border: "2px solid #3fe2cd",
              borderRadius: "12px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
            }}>
              <div className="modal-header" style={{
                background: "linear-gradient(135deg, #17a2b8, #20c997)",
                color: "white",
                borderRadius: "10px 10px 0 0",
                borderBottom: "none"
              }}>
                <h5 className="modal-title fw-bold">Leave Request Details</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Employee</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getEmployeeName(viewingRequest.Employee_Id)}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Department</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getDepartmentName(viewingRequest.Employee_Id)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Status</label>
                      <div className="p-2" style={{ 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        <span className="badge px-3 py-2" style={{ 
                          background: getStatusColor(viewingRequest.Status),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.875rem"
                        }}>
                          {getStatusIcon(viewingRequest.Status)} {viewingRequest.Status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Total Days</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {calculateLeaveDays(viewingRequest.Start_Date, viewingRequest.End_Date)} days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Start Date</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {new Date(viewingRequest.Start_Date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>End Date</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {new Date(viewingRequest.End_Date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Reason</label>
                  <p className="mb-0 p-2" style={{ 
                    color: "#5a6c6b", 
                    background: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #e9ecef",
                    minHeight: "80px"
                  }}>
                    {viewingRequest.Reason || 'No reason provided'}
                  </p>
                </div>
                {viewingRequest.Comments && (
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Admin Comments</label>
                    <p className="mb-0 p-2" style={{ 
                      color: "#5a6c6b", 
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef"
                    }}>
                      {viewingRequest.Comments}
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ 
                background: "#f8f9fa",
                borderTop: "1px solid #dee2e6",
                borderRadius: "0 0 10px 10px"
              }}>
                {viewingRequest.Status === 'Pending' && (
                  <>
                    <button 
                      className="btn me-2"
                      onClick={() => {
                        setShowViewModal(false);
                        handleLeaveAction(viewingRequest, 'Approved');
                      }}
                      disabled={saving}
                      style={{
                        background: "linear-gradient(45deg, #28a745, #20c997)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px"
                      }}
                    >
                      <CheckCircle size={16} className="me-1" />Approve
                    </button>
                    <button 
                      className="btn me-2"
                      onClick={() => {
                        setShowViewModal(false);
                        handleLeaveAction(viewingRequest, 'Rejected');
                      }}
                      disabled={saving}
                      style={{
                        background: "linear-gradient(45deg, #dc3545, #c82333)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px"
                      }}
                    >
                      <XCircle size={16} className="me-1" />Reject
                    </button>
                  </>
                )}
                <button 
                  className="btn"
                  onClick={() => setShowViewModal(false)}
                  style={{
                    background: "linear-gradient(45deg, #17a2b8, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;