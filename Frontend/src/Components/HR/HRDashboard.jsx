import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Clock, CheckCircle, 
  XCircle, User, FileText, CalendarDays, AlertCircle,
  Building2, Users, BarChart3, TrendingUp, CheckSquare,
  X, MessageSquare, Shield, DollarSign, UserCheck,
  UserX, Cake, Gift, Bell, Home, Briefcase, Menu
} from 'lucide-react';

const HRMDashboard = () => {
  // User and authentication state
  const [currentUser, setCurrentUser] = useState({
    Employee_Id: 'HR001',
    First_Name: 'Admin',
    Last_Name: 'User',
    role: 'HR'
  });

  // Active module state
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalEmployees: 156,
    presentToday: 142,
    absentToday: 14,
    pendingLeaves: 8,
    upcomingBirthdays: 5,
    totalSalaryProcessed: 2850000
  });

  // Leave Management State (Dynamic from your original code)
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([
    {
      Employee_Id: 'EMP001',
      First_Name: 'John',
      Last_Name: 'Doe',
      Department: 'Engineering',
      Position: 'Software Developer'
    },
    {
      Employee_Id: 'EMP002',
      First_Name: 'Jane',
      Last_Name: 'Smith',
      Department: 'Marketing',
      Position: 'Marketing Manager'
    },
    {
      Employee_Id: 'EMP003',
      First_Name: 'Mike',
      Last_Name: 'Johnson',
      Department: 'Sales',
      Position: 'Sales Executive'
    },
    {
      Employee_Id: 'EMP004',
      First_Name: 'Sarah',
      Last_Name: 'Williams',
      Department: 'HR',
      Position: 'HR Specialist'
    },
    {
      Employee_Id: 'EMP005',
      First_Name: 'Lisa',
      Last_Name: 'Brown',
      Department: 'Finance',
      Position: 'Accountant'
    }
  ]);

  const [saving, setSaving] = useState(false);
  
  // Leave form state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [approvalRequest, setApprovalRequest] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalComments, setApprovalComments] = useState('');

  const [leaveFormData, setLeaveFormData] = useState({
    Leave_Id: '',
    First_Name: '',
    Last_Name: '',
    Employee_Id: '',
    Start_Date: '',
    End_Date: '',
    Reason: '',
    status: 'Pending'
  });

  // Attendance state
  const [attendanceData, setAttendanceData] = useState([
    {
      Employee_Id: 'EMP001',
      First_Name: 'John',
      Last_Name: 'Doe',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'Present',
      workingHours: '9h 0m',
      date: '2025-09-28'
    },
    {
      Employee_Id: 'EMP002',
      First_Name: 'Jane',
      Last_Name: 'Smith',
      checkIn: '09:15 AM',
      checkOut: '06:15 PM',
      status: 'Present',
      workingHours: '9h 0m',
      date: '2025-09-28'
    },
    {
      Employee_Id: 'EMP003',
      First_Name: 'Mike',
      Last_Name: 'Johnson',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      workingHours: '0h 0m',
      date: '2025-09-28'
    },
    {
      Employee_Id: 'EMP004',
      First_Name: 'Sarah',
      Last_Name: 'Williams',
      checkIn: '08:45 AM',
      checkOut: 'In Progress',
      status: 'Present',
      workingHours: 'In Progress',
      date: '2025-09-28'
    }
  ]);

  // Payroll state
  const [payrollData, setPayrollData] = useState([
    {
      Employee_Id: 'EMP001',
      First_Name: 'John',
      Last_Name: 'Doe',
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 55000,
      status: 'Processed',
      month: 'September 2025'
    },
    {
      Employee_Id: 'EMP002',
      First_Name: 'Jane',
      Last_Name: 'Smith',
      basicSalary: 60000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 66000,
      status: 'Pending',
      month: 'September 2025'
    },
    {
      Employee_Id: 'EMP003',
      First_Name: 'Mike',
      Last_Name: 'Johnson',
      basicSalary: 45000,
      allowances: 8000,
      deductions: 4500,
      netSalary: 48500,
      status: 'Processed',
      month: 'September 2025'
    }
  ]);

  // Birthday state
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([
    {
      Employee_Id: 'EMP001',
      First_Name: 'John',
      Last_Name: 'Doe',
      birthDate: '1990-10-05',
      department: 'Engineering',
      daysLeft: 7
    },
    {
      Employee_Id: 'EMP005',
      First_Name: 'Lisa',
      Last_Name: 'Brown',
      birthDate: '1988-10-10',
      department: 'Finance',
      daysLeft: 12
    },
    {
      Employee_Id: 'EMP002',
      First_Name: 'Jane',
      Last_Name: 'Smith',
      birthDate: '1992-10-15',
      department: 'Marketing',
      daysLeft: 17
    }
  ]);

  // Load initial data
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Dynamic leave request functions (from your original code)
  const fetchLeaveRequests = async () => {
    try {
      // Mock data for demo - replace with your API call
      const mockLeaves = [
        {
          Leave_Id: 'LV001',
          Employee_Id: 'EMP001',
          First_Name: 'John',
          Last_Name: 'Doe',
          Start_Date: '2025-10-01',
          End_Date: '2025-10-05',
          status: 'Pending',
          Reason: 'Medical leave for surgery'
        },
        {
          Leave_Id: 'LV002',
          Employee_Id: 'EMP002',
          First_Name: 'Jane',
          Last_Name: 'Smith',
          Start_Date: '2025-09-25',
          End_Date: '2025-09-27',
          status: 'Approved',
          Reason: 'Personal work'
        },
        {
          Leave_Id: 'LV003',
          Employee_Id: 'EMP003',
          First_Name: 'Mike',
          Last_Name: 'Johnson',
          Start_Date: '2025-10-10',
          End_Date: '2025-10-12',
          status: 'Rejected',
          Reason: 'Family function'
        }
      ];
      
      setLeaveRequests(mockLeaves);
      updateLeaveStats(mockLeaves);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setLeaveRequests([]);
    }
  };

  const updateLeaveStats = (requests) => {
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    setStats(prevStats => ({
      ...prevStats,
      pendingLeaves: pendingCount
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Present':
      case 'Processed':
        return 'linear-gradient(45deg, #28a745, #20c997)';
      case 'Rejected':
      case 'Absent':
        return 'linear-gradient(45deg, #dc3545, #c82333)';
      default:
        return 'linear-gradient(45deg, #ffc107, #fd7e14)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Present':
      case 'Processed':
        return <CheckCircle size={14} />;
      case 'Rejected':
      case 'Absent':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveFormData({ ...leaveFormData, [name]: value });
    
    if (name === 'Employee_Id') {
      const selectedEmployee = employees.find(emp => emp.Employee_Id == value);
      if (selectedEmployee) {
        setLeaveFormData(prev => ({
          ...prev,
          Employee_Id: value,
          First_Name: selectedEmployee.First_Name || '',
          Last_Name: selectedEmployee.Last_Name || ''
        }));
      }
    }
  };

  const openAddLeaveModal = () => {
    setEditingRequest(null);
    setLeaveFormData({
      Leave_Id: '',
      First_Name: currentUser?.First_Name || '',
      Last_Name: currentUser?.Last_Name || '',
      Employee_Id: currentUser?.Employee_Id || '',
      Start_Date: '',
      End_Date: '',
      Reason: '',
      status: 'Pending'
    });
    setShowLeaveModal(true);
  };

  const handleSaveLeave = async () => {
    setSaving(true);
    try {
      const formattedData = {
        ...leaveFormData,
        Start_Date: leaveFormData.Start_Date
          ? new Date(leaveFormData.Start_Date).toISOString().split("T")[0]
          : null,
        End_Date: leaveFormData.End_Date
          ? new Date(leaveFormData.End_Date).toISOString().split("T")[0]
          : null,
        Employee_Id: leaveFormData.Employee_Id ? leaveFormData.Employee_Id : null,
      };

      // Validation
      if (!formattedData.Employee_Id) {
        alert("Please select an employee");
        setSaving(false);
        return;
      }

      if (!formattedData.Start_Date || !formattedData.End_Date) {
        alert("Please select both start and end dates");
        setSaving(false);
        return;
      }

      if (new Date(formattedData.Start_Date) > new Date(formattedData.End_Date)) {
        alert("End date cannot be before start date");
        setSaving(false);
        return;
      }

      // Mock save for demo
      if (editingRequest) {
        const updatedRequests = leaveRequests.map(request =>
          request.Leave_Id === editingRequest.Leave_Id
            ? { ...formattedData }
            : request
        );
        setLeaveRequests(updatedRequests);
        updateLeaveStats(updatedRequests);
      } else {
        const newRequest = {
          ...formattedData,
          Leave_Id: `LV${String(leaveRequests.length + 1).padStart(3, '0')}`
        };
        const updatedRequests = [...leaveRequests, newRequest];
        setLeaveRequests(updatedRequests);
        updateLeaveStats(updatedRequests);
      }

      alert(editingRequest ? "Leave request updated successfully!" : "Leave request added successfully!");
      setShowLeaveModal(false);
    } catch (error) {
      console.error("Error saving leave request:", error);
      alert("Error saving leave request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleApproval = async () => {
    setSaving(true);
    try {
      const updatedRequests = leaveRequests.map((request) =>
        request.Leave_Id === approvalRequest.Leave_Id 
          ? { ...request, status: approvalAction, comments: approvalComments }
          : request
      );

      setLeaveRequests(updatedRequests);
      updateLeaveStats(updatedRequests);

      alert(`Leave request ${approvalAction.toLowerCase()} successfully!`);
      setShowApprovalModal(false);
    } catch (error) {
      console.error("Error updating leave request:", error);
      alert("Error updating leave request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const calculateLeaveDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getEmployeeName = (employeeId, firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    const employee = employees.find(emp => emp.Employee_Id == employeeId);
    return employee ? `${employee.First_Name} ${employee.Last_Name}` : `Employee ${employeeId}`;
  };

  // Navigation component
  const Navigation = () => (
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
        <div className="d-flex flex-wrap gap-2">
          <button 
            className={`btn ${activeModule === 'dashboard' ? 'active' : ''}`}
            style={{
              background: activeModule === 'dashboard' 
                ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
              color: activeModule === 'dashboard' ? "white" : "#2c5f5d",
              border: "1px solid rgba(63, 226, 205, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={() => setActiveModule('dashboard')}
          >
            <Home size={16} className="me-1" />
            Dashboard
          </button>
          <button 
            className={`btn ${activeModule === 'attendance' ? 'active' : ''}`}
            style={{
              background: activeModule === 'attendance' 
                ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
              color: activeModule === 'attendance' ? "white" : "#2c5f5d",
              border: "1px solid rgba(63, 226, 205, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={() => setActiveModule('attendance')}
          >
            <UserCheck size={16} className="me-1" />
            Attendance
          </button>
          <button 
            className={`btn ${activeModule === 'leaves' ? 'active' : ''}`}
            style={{
              background: activeModule === 'leaves' 
                ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
              color: activeModule === 'leaves' ? "white" : "#2c5f5d",
              border: "1px solid rgba(63, 226, 205, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={() => setActiveModule('leaves')}
          >
            <Calendar size={16} className="me-1" />
            Leave Requests
          </button>
          <button 
            className={`btn ${activeModule === 'payroll' ? 'active' : ''}`}
            style={{
              background: activeModule === 'payroll' 
                ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
              color: activeModule === 'payroll' ? "white" : "#2c5f5d",
              border: "1px solid rgba(63, 226, 205, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={() => setActiveModule('payroll')}
          >
            <DollarSign size={16} className="me-1" />
            Payroll
          </button>
          <button 
            className={`btn ${activeModule === 'birthdays' ? 'active' : ''}`}
            style={{
              background: activeModule === 'birthdays' 
                ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                : "linear-gradient(to right, #ffffff80, #3fe2cd20)",
              color: activeModule === 'birthdays' ? "white" : "#2c5f5d",
              border: "1px solid rgba(63, 226, 205, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={() => setActiveModule('birthdays')}
          >
            <Cake size={16} className="me-1" />
            Birthdays
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Overview
  const DashboardOverview = () => (
    <>
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <Users size={32} className="mb-2" style={{ color: "#2c5f5d" }} />
              <h3 className="mb-1" style={{ color: "#2c5f5d" }}>{stats.totalEmployees}</h3>
              <small style={{ color: "#5a6c6b" }}>Total Employees</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #28a74515)",
              border: "1px solid rgba(40, 167, 69, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <UserCheck size={32} className="mb-2" style={{ color: "#28a745" }} />
              <h3 className="mb-1" style={{ color: "#28a745" }}>{stats.presentToday}</h3>
              <small style={{ color: "#5a6c6b" }}>Present Today</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #dc354515)",
              border: "1px solid rgba(220, 53, 69, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <UserX size={32} className="mb-2" style={{ color: "#dc3545" }} />
              <h3 className="mb-1" style={{ color: "#dc3545" }}>{stats.absentToday}</h3>
              <small style={{ color: "#5a6c6b" }}>Absent Today</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #ffc10715)",
              border: "1px solid rgba(255, 193, 7, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <Clock size={32} className="mb-2" style={{ color: "#ffc107" }} />
              <h3 className="mb-1" style={{ color: "#ffc107" }}>{stats.pendingLeaves}</h3>
              <small style={{ color: "#5a6c6b" }}>Pending Leaves</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #17a2b815)",
              border: "1px solid rgba(23, 162, 184, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <DollarSign size={32} className="mb-2" style={{ color: "#17a2b8" }} />
              <h3 className="mb-1" style={{ color: "#17a2b8" }}>₹{(stats.totalSalaryProcessed/100000).toFixed(1)}L</h3>
              <small style={{ color: "#5a6c6b" }}>Salary Processed</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #fd7e1415)",
              border: "1px solid rgba(253, 126, 20, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body text-center">
              <Cake size={32} className="mb-2" style={{ color: "#fd7e14" }} />
              <h3 className="mb-1" style={{ color: "#fd7e14" }}>{stats.upcomingBirthdays}</h3>
              <small style={{ color: "#5a6c6b" }}>Upcoming Birthdays</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-header" style={{ 
              background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
              border: "none",
              borderRadius: "11px 11px 0 0"
            }}>
              <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                <Calendar size={16} className="me-2" />
                Recent Leave Requests
              </h6>
            </div>
            <div className="card-body">
              {leaveRequests.slice(0, 3).map((request) => (
                <div key={request.Leave_Id} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ 
                  background: "#f8f9fa", 
                  borderRadius: "8px",
                  border: "1px solid rgba(63, 226, 205, 0.1)"
                }}>
                  <div>
                    <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                      {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                    </div>
                    <small style={{ color: "#5a6c6b" }}>
                      {calculateLeaveDays(request.Start_Date, request.End_Date)} days
                    </small>
                  </div>
                  <span 
                    className="badge"
                    style={{ 
                      background: getStatusColor(request.status),
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.75rem"
                    }}
                  >
                    {request.status}
                  </span>
                </div>
              ))}
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
                View All Leaves
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div 
            className="card h-100"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-header" style={{ 
              background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
              border: "none",
              borderRadius: "11px 11px 0 0"
            }}>
              <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                <Cake size={16} className="me-2" />
                Upcoming Birthdays
              </h6>
            </div>
            <div className="card-body">
              {upcomingBirthdays.slice(0, 3).map((birthday) => (
                <div key={birthday.Employee_Id} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ 
                  background: "#f8f9fa", 
                  borderRadius: "8px",
                  border: "1px solid rgba(63, 226, 205, 0.1)"
                }}>
                  <div>
                    <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "0.875rem" }}>
                      {birthday.First_Name} {birthday.Last_Name}
                    </div>
                    <small style={{ color: "#5a6c6b" }}>
                      {birthday.department}
                    </small>
                  </div>
                  <span 
                    className="badge"
                    style={{ 
                      background: "linear-gradient(45deg, #fd7e14, #ffc107)",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.75rem"
                    }}
                  >
                    {birthday.daysLeft} days
                  </span>
                </div>
              ))}
              <button 
                className="btn btn-sm w-100 mt-2"
                style={{
                  background: "linear-gradient(45deg, #fd7e14, #ffc107)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={() => setActiveModule('birthdays')}
              >
                View All Birthdays
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Attendance Module
  const AttendanceModule = () => (
    <div 
      className="card"
      style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px"
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center" style={{ 
        background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
        border: "none",
        borderRadius: "11px 11px 0 0"
      }}>
        <h5 className="mb-0" style={{ color: "#2c5f5d" }}>
          <UserCheck size={20} className="me-2" />
          Today's Attendance - {new Date().toLocaleDateString()}
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)" }}>
              <tr>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Check In</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Check Out</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Working Hours</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance) => (
                <tr key={attendance.Employee_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                  <td className="px-4 py-3">
                    <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                      {attendance.First_Name} {attendance.Last_Name}
                    </div>
                    <small style={{ color: "#5a6c6b" }}>ID: {attendance.Employee_Id}</small>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>{attendance.checkIn}</td>
                  <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>{attendance.checkOut}</td>
                  <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>{attendance.workingHours}</td>
                  <td className="px-4 py-3">
                    <span 
                      className="badge px-3 py-2"
                      style={{ 
                        background: getStatusColor(attendance.status),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.75rem"
                      }}
                    >
                      {getStatusIcon(attendance.status)} {attendance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Leave Requests Module (Your Dynamic Code)
  const LeaveRequestsModule = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: "#2c5f5d" }}>
          <Calendar size={20} className="me-2" />
          Leave Management System
        </h5>
        <button 
          className="btn"
          style={{
            background: "linear-gradient(45deg, #28a745, #20c997)",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
          onClick={openAddLeaveModal}
        >
          <Plus size={16} className="me-1" />
          Add Leave Request
        </button>
      </div>

      <div 
        className="card"
        style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px"
        }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)" }}>
                <tr>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave ID</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave Period</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Days</th>
                  <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
                  <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.Leave_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                    <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{request.Leave_Id}</td>
                    <td className="px-4 py-3">
                      <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                        {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                      </div>
                      <small style={{ color: "#5a6c6b" }}>ID: {request.Employee_Id}</small>
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
                      <span 
                        className="badge px-3 py-2"
                        style={{ 
                          background: getStatusColor(request.status),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.75rem"
                        }}
                      >
                        {getStatusIcon(request.status)} {request.status}
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
                        {request.status === 'Pending' && (
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
                              onClick={() => {
                                setApprovalRequest(request);
                                setApprovalAction('Approved');
                                setApprovalComments('');
                                setShowApprovalModal(true);
                              }}
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
                              onClick={() => {
                                setApprovalRequest(request);
                                setApprovalAction('Rejected');
                                setApprovalComments('');
                                setShowApprovalModal(true);
                              }}
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
    </>
  );

  // Payroll Module
  const PayrollModule = () => (
    <div 
      className="card"
      style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px"
      }}
    >
      <div className="card-header" style={{ 
        background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
        border: "none",
        borderRadius: "11px 11px 0 0"
      }}>
        <h5 className="mb-0" style={{ color: "#2c5f5d" }}>
          <DollarSign size={20} className="me-2" />
          Payroll Management - September 2025
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)" }}>
              <tr>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Basic Salary</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Allowances</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Deductions</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Net Salary</th>
                <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((payroll) => (
                <tr key={payroll.Employee_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                  <td className="px-4 py-3">
                    <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                      {payroll.First_Name} {payroll.Last_Name}
                    </div>
                    <small style={{ color: "#5a6c6b" }}>ID: {payroll.Employee_Id}</small>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>₹{payroll.basicSalary.toLocaleString()}</td>
                  <td className="px-4 py-3" style={{ color: "#28a745" }}>₹{payroll.allowances.toLocaleString()}</td>
                  <td className="px-4 py-3" style={{ color: "#dc3545" }}>₹{payroll.deductions.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="fw-bold" style={{ color: "#2c5f5d" }}>₹{payroll.netSalary.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="badge px-3 py-2"
                      style={{ 
                        background: getStatusColor(payroll.status),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.75rem"
                      }}
                    >
                      {getStatusIcon(payroll.status)} {payroll.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Birthdays Module
  const BirthdaysModule = () => (
    <div 
      className="card"
      style={{
        background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
        border: "1px solid rgba(63, 226, 205, 0.2)",
        borderRadius: "12px"
      }}
    >
      <div className="card-header" style={{ 
        background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
        border: "none",
        borderRadius: "11px 11px 0 0"
      }}>
        <h5 className="mb-0" style={{ color: "#2c5f5d" }}>
          <Cake size={20} className="me-2" />
          Upcoming Employee Birthdays
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {upcomingBirthdays.map((birthday) => (
            <div key={birthday.Employee_Id} className="col-md-4 mb-3">
              <div 
                className="card h-100"
                style={{
                  background: "linear-gradient(135deg, #ffffff95, #fd7e1420)",
                  border: "1px solid rgba(253, 126, 20, 0.2)",
                  borderRadius: "12px"
                }}
              >
                <div className="card-body text-center">
                  <Gift size={32} className="mb-3" style={{ color: "#fd7e14" }} />
                  <h6 className="fw-bold mb-1" style={{ color: "#2c5f5d" }}>
                    {birthday.First_Name} {birthday.Last_Name}
                  </h6>
                  <p className="mb-1" style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                    {birthday.department}
                  </p>
                  <p className="mb-2" style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                    {new Date(birthday.birthDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <span 
                    className="badge px-3 py-2"
                    style={{ 
                      background: "linear-gradient(45deg, #fd7e14, #ffc107)",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.75rem"
                    }}
                  >
                    {birthday.daysLeft} days to go
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="p-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
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
          <div className="d-flex align-items-center">
            <Shield size={24} className="me-2" style={{ color: "#2c5f5d" }} />
            <div>
              <h4 className="mb-0" style={{ color: "#2c5f5d" }}>HRM Dashboard</h4>
              <small style={{ color: "#5a6c6b" }}>
                Welcome, {currentUser?.First_Name} {currentUser?.Last_Name} ({currentUser?.role})
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Module Content */}
      {activeModule === 'dashboard' && <DashboardOverview />}
      {activeModule === 'attendance' && <AttendanceModule />}
      {activeModule === 'leaves' && <LeaveRequestsModule />}
      {activeModule === 'payroll' && <PayrollModule />}
      {activeModule === 'birthdays' && <BirthdaysModule />}

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div 
          className="modal show d-block" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div 
              className="modal-content"
              style={{
                background: "#ffffff",
                border: "2px solid #3fe2cd",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
              }}
            >
              <div 
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
                  color: "white",
                  borderRadius: "10px 10px 0 0",
                  borderBottom: "none"
                }}
              >
                <h5 className="modal-title fw-bold">Add New Leave Request</h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowLeaveModal(false)}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Employee *
                      </label>
                      <select
                        className="form-select"
                        name="Employee_Id"
                        value={leaveFormData.Employee_Id}
                        onChange={handleLeaveChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.Employee_Id} value={emp.Employee_Id}>
                            {emp.First_Name} {emp.Last_Name} ({emp.Employee_Id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="Start_Date"
                        value={leaveFormData.Start_Date}
                        onChange={handleLeaveChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        End Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="End_Date"
                        value={leaveFormData.End_Date}
                        onChange={handleLeaveChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <FileText size={16} className="me-1" />
                        Reason
                      </label>
                      <textarea
                        className="form-control"
                        name="Reason"
                        value={leaveFormData.Reason}
                        onChange={handleLeaveChange}
                        placeholder="Enter reason for leave"
                        rows="3"
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="modal-footer" 
                style={{ 
                  background: "#f8f9fa",
                  borderTop: "1px solid #dee2e6",
                  borderRadius: "0 0 10px 10px"
                }}
              >
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowLeaveModal(false)}
                  disabled={saving}
                  style={{
                    background: "#6c757d",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn ms-2"
                  onClick={handleSaveLeave}
                  disabled={saving}
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  {saving ? 'Saving...' : 'Save Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingRequest && (
        <div 
          className="modal show d-block" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div 
              className="modal-content"
              style={{
                background: "#ffffff",
                border: "2px solid #3fe2cd",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
              }}
            >
              <div 
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white",
                  borderRadius: "10px 10px 0 0",
                  borderBottom: "none"
                }}
              >
                <h5 className="modal-title fw-bold">Leave Request Details</h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Leave ID</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRequest.Leave_Id}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Employee</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getEmployeeName(viewingRequest.Employee_Id, viewingRequest.First_Name, viewingRequest.Last_Name)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>Leave Period</label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {new Date(viewingRequest.Start_Date).toLocaleDateString()} - {new Date(viewingRequest.End_Date).toLocaleDateString()}
                      </p>
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
              </div>
              <div 
                className="modal-footer" 
                style={{ 
                  background: "#f8f9fa",
                  borderTop: "1px solid #dee2e6",
                  borderRadius: "0 0 10px 10px"
                }}
              >
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

      {/* Approval Modal */}
      {showApprovalModal && approvalRequest && (
        <div 
          className="modal show d-block" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div 
              className="modal-content"
              style={{
                background: "#ffffff",
                border: "2px solid #3fe2cd",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
              }}
            >
              <div 
                className="modal-header"
                style={{
                  background: approvalAction === 'Approved' 
                    ? "linear-gradient(135deg, #28a745, #20c997)" 
                    : "linear-gradient(135deg, #dc3545, #c82333)",
                  color: "white",
                  borderRadius: "10px 10px 0 0",
                  borderBottom: "none"
                }}
              >
                <h5 className="modal-title fw-bold">
                  {approvalAction === 'Approved' ? 'Approve' : 'Reject'} Leave Request
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowApprovalModal(false)}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="mb-3">
                  <h6 style={{ color: "#2c5f5d" }}>Employee Details:</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {getEmployeeName(approvalRequest.Employee_Id, approvalRequest.First_Name, approvalRequest.Last_Name)}
                  </p>
                  <p className="mb-1">
                    <strong>Leave ID:</strong> {approvalRequest.Leave_Id}
                  </p>
                  <p className="mb-1">
                    <strong>Period:</strong> {new Date(approvalRequest.Start_Date).toLocaleDateString()} - {new Date(approvalRequest.End_Date).toLocaleDateString()}
                  </p>
                  <p className="mb-3">
                    <strong>Days:</strong> {calculateLeaveDays(approvalRequest.Start_Date, approvalRequest.End_Date)} days
                  </p>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                    <MessageSquare size={16} className="me-1" />
                    Comments (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    placeholder={`Add comments for ${approvalAction.toLowerCase()}ing this leave request...`}
                    rows="3"
                    disabled={saving}
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "10px 12px"
                    }}
                  />
                </div>
                
                <div className="alert" style={{
                  background: approvalAction === 'Approved' 
                    ? "rgba(40, 167, 69, 0.1)" 
                    : "rgba(220, 53, 69, 0.1)",
                  border: `1px solid ${approvalAction === 'Approved' ? '#28a745' : '#dc3545'}`,
                  borderRadius: "8px",
                  color: approvalAction === 'Approved' ? '#155724' : '#721c24'
                }}>
                  Are you sure you want to <strong>{approvalAction.toLowerCase()}</strong> this leave request?
                </div>
              </div>
              <div 
                className="modal-footer" 
                style={{ 
                  background: "#f8f9fa",
                  borderTop: "1px solid #dee2e6",
                  borderRadius: "0 0 10px 10px"
                }}
              >
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowApprovalModal(false)}
                  disabled={saving}
                  style={{
                    background: "#6c757d",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn ms-2"
                  onClick={handleApproval}
                  disabled={saving}
                  style={{
                    background: approvalAction === 'Approved' 
                      ? "linear-gradient(45deg, #28a745, #20c997)" 
                      : "linear-gradient(45deg, #dc3545, #c82333)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  {saving ? 'Processing...' : `${approvalAction} Request`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRMDashboard;