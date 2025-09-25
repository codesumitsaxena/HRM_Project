import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Eye, Filter, Search, Download, User, AlertCircle } from 'lucide-react';

// Bootstrap CSS loader
const BootstrapCSS = () => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  
  return null;
};

const AdminLeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Sample leave data
  const leaveRequests = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'IT',
      designation: 'Senior Developer',
      leaveType: 'Sick Leave',
      startDate: '2024-09-25',
      endDate: '2024-09-27',
      days: 3,
      reason: 'Fever and cold symptoms',
      appliedDate: '2024-09-20',
      status: 'Pending',
      manager: 'Priya Singh',
      document: 'medical-certificate.pdf'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Kavita Joshi',
      department: 'HR',
      designation: 'HR Executive',
      leaveType: 'Annual Leave',
      startDate: '2024-10-01',
      endDate: '2024-10-05',
      days: 5,
      reason: 'Family vacation',
      appliedDate: '2024-09-15',
      status: 'Approved',
      manager: 'Amit Kumar',
      approvedBy: 'Amit Kumar',
      approvedDate: '2024-09-16'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Suresh Yadav',
      department: 'Finance',
      designation: 'Accountant',
      leaveType: 'Personal Leave',
      startDate: '2024-09-26',
      endDate: '2024-09-26',
      days: 1,
      reason: 'Personal work',
      appliedDate: '2024-09-22',
      status: 'Rejected',
      manager: 'Meera Agarwal',
      rejectedBy: 'Meera Agarwal',
      rejectedDate: '2024-09-23',
      rejectionReason: 'Important project deadline'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Neha Patel',
      department: 'Marketing',
      designation: 'Marketing Manager',
      leaveType: 'Maternity Leave',
      startDate: '2024-10-15',
      endDate: '2025-01-15',
      days: 92,
      reason: 'Maternity leave',
      appliedDate: '2024-09-10',
      status: 'Approved',
      manager: 'Vikash Gupta',
      approvedBy: 'Vikash Gupta',
      approvedDate: '2024-09-11'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'Ravi Kumar',
      department: 'IT',
      designation: 'Junior Developer',
      leaveType: 'Emergency Leave',
      startDate: '2024-09-24',
      endDate: '2024-09-24',
      days: 1,
      reason: 'Family emergency',
      appliedDate: '2024-09-24',
      status: 'Pending',
      manager: 'Priya Singh'
    }
  ];

  // Filter leave requests based on status
  const getFilteredLeaves = () => {
    let filtered = leaveRequests;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(leave => leave.status.toLowerCase() === activeTab);
    }
    
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(leave => leave.employeeId === selectedEmployee);
    }
    
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(leave => leave.department === selectedDepartment);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Get unique departments and employees for filters
  const departments = [...new Set(leaveRequests.map(leave => leave.department))];
  const employees = [...new Set(leaveRequests.map(leave => ({ id: leave.employeeId, name: leave.employeeName })))];

  // Handle leave approval/rejection
  const handleLeaveAction = (leaveId, action) => {
    console.log(`${action} leave request with ID: ${leaveId}`);
    // Here you would typically call an API to update the leave status
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-warning';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Get leave type color
  const getLeaveTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'sick leave': return 'text-danger';
      case 'annual leave': return 'text-success';
      case 'personal leave': return 'text-info';
      case 'maternity leave': return 'text-purple';
      case 'emergency leave': return 'text-warning';
      default: return 'text-dark';
    }
  };

  // Leave statistics
  const getLeaveStats = () => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(leave => leave.status === 'Pending').length;
    const approved = leaveRequests.filter(leave => leave.status === 'Approved').length;
    const rejected = leaveRequests.filter(leave => leave.status === 'Rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getLeaveStats();

  return (
    <div>
      <BootstrapCSS />
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Leave Management</h2>
          <p className="text-muted mb-0">Manage employee leave requests and history</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <Download size={16} className="me-1" />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <Calendar className="text-primary" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-primary mb-1">{stats.total}</h3>
              <p className="text-muted small mb-0">Total Requests</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <Clock className="text-warning" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-warning mb-1">{stats.pending}</h3>
              <p className="text-muted small mb-0">Pending Approval</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-success mb-1">{stats.approved}</h3>
              <p className="text-muted small mb-0">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <XCircle className="text-danger" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-danger mb-1">{stats.rejected}</h3>
              <p className="text-muted small mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Search size={16} />
                </span>
                <input 
                  type="text" 
                  className="form-control border-0 bg-light" 
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <select 
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <select 
                className="form-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100">
                <Filter size={16} className="me-1" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Tabs */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Requests ({stats.pending})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
                onClick={() => setActiveTab('approved')}
              >
                Approved ({stats.approved})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected ({stats.rejected})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Requests ({stats.total})
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredLeaves().map(leave => (
                  <tr key={leave.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-medium">{leave.employeeName}</h6>
                          <small className="text-muted">{leave.employeeId} • {leave.department}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`fw-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType}
                      </span>
                      <small className="d-block text-muted">{leave.reason}</small>
                    </td>
                    <td>
                      <div>
                        <strong>{leave.days} day{leave.days > 1 ? 's' : ''}</strong>
                        <small className="d-block text-muted">
                          {leave.startDate} to {leave.endDate}
                        </small>
                      </div>
                    </td>
                    <td>{leave.appliedDate}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.manager}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => {
                            setSelectedLeave(leave);
                            setShowModal(true);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        {leave.status === 'Pending' && (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleLeaveAction(leave.id, 'approve')}
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleLeaveAction(leave.id, 'reject')}
                            >
                              <XCircle size={14} />
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
          
          {getFilteredLeaves().length === 0 && (
            <div className="text-center py-5">
              <AlertCircle size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No leave requests found</h5>
              <p className="text-muted">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Leave Details Modal */}
      {showModal && selectedLeave && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leave Request Details</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Employee Information</h6>
                    <p><strong>Name:</strong> {selectedLeave.employeeName}</p>
                    <p><strong>Employee ID:</strong> {selectedLeave.employeeId}</p>
                    <p><strong>Department:</strong> {selectedLeave.department}</p>
                    <p><strong>Designation:</strong> {selectedLeave.designation}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Leave Details</h6>
                    <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
                    <p><strong>Duration:</strong> {selectedLeave.days} day(s)</p>
                    <p><strong>From:</strong> {selectedLeave.startDate}</p>
                    <p><strong>To:</strong> {selectedLeave.endDate}</p>
                    <p><strong>Applied Date:</strong> {selectedLeave.appliedDate}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h6 className="fw-bold mb-2">Reason</h6>
                  <p className="bg-light p-3 rounded">{selectedLeave.reason}</p>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">Status</h6>
                    <span className={`badge ${getStatusBadge(selectedLeave.status)} fs-6`}>
                      {selectedLeave.status}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">Manager</h6>
                    <p>{selectedLeave.manager}</p>
                  </div>
                </div>

                {selectedLeave.approvedBy && (
                  <div className="mt-3">
                    <h6 className="fw-bold mb-2">Approval Details</h6>
                    <p><strong>Approved by:</strong> {selectedLeave.approvedBy}</p>
                    <p><strong>Approved on:</strong> {selectedLeave.approvedDate}</p>
                  </div>
                )}

                {selectedLeave.rejectedBy && (
                  <div className="mt-3">
                    <h6 className="fw-bold mb-2">Rejection Details</h6>
                    <p><strong>Rejected by:</strong> {selectedLeave.rejectedBy}</p>
                    <p><strong>Rejected on:</strong> {selectedLeave.rejectedDate}</p>
                    <p><strong>Reason:</strong> {selectedLeave.rejectionReason}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedLeave.status === 'Pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => {
                        handleLeaveAction(selectedLeave.id, 'approve');
                        setShowModal(false);
                      }}
                    >
                      <CheckCircle size={16} className="me-1" />
                      Approve
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => {
                        handleLeaveAction(selectedLeave.id, 'reject');
                        setShowModal(false);
                      }}
                    >
                      <XCircle size={16} className="me-1" />
                      Reject
                    </button>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
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

export default AdminLeaveManagement;