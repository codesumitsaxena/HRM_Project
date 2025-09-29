import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Clock, CheckCircle, 
  XCircle, User, FileText, CalendarDays, AlertCircle,
  Building2, Users
} from 'lucide-react';

const LeaveRequestTable = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Get current user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    fetchLeaveRequests();
    fetchEmployees();
  }, []);
  
  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/hr-leaves", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch leaves`);
      }
  
      const data = await response.json();
      setLeaveRequests(Array.isArray(data) ? data : data.leaveRequests || []);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setLeaveRequests([]);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch employees`);
      }
  
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterLeaveType, setFilterLeaveType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Employee_Id: '',
    Leave_Type: 'Casual Leave',  // Changed from Leave_Type
    Start_Date: '',
    End_Date: '',
    Reason: '',
    status: 'Pending'
  });
  // Leave types from database enum
  const leaveTypes = [
    { value: 'Casual Leave', label: 'Casual Leave', color: '#17a2b8' },
    { value: 'Sick Leave', label: 'Sick Leave', color: '#dc3545' },
    { value: 'Earned Leave', label: 'Earned Leave', color: '#28a745' }
  ];

  const statusOptions = ['Pending', 'Approved', 'Rejected'];

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

  const getLeaveTypeColor = (leaveType) => {
    const type = leaveTypes.find(t => t.value === leaveType);
    return type ? type.color : '#17a2b8';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-populate employee info if Employee_Id changes (for admin/HR users)
    if (name === 'Employee_Id') {
      const selectedEmployee = employees.find(emp => emp.Employee_Id == value);
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          Employee_Id: value,
          First_Name: selectedEmployee.First_Name || '',
          Last_Name: selectedEmployee.Last_Name || ''
        }));
      }
    }
  };

  const openAddModal = () => {
    setEditingRequest(null);
    
    // Auto-populate current user's information
    const userEmployee = employees.find(emp => emp.Employee_Id == currentUser?.employeeId || emp.Employee_Id == currentUser?.userId);
    
    setFormData({
      First_Name: userEmployee?.First_Name || currentUser?.name?.split(' ')[0] || '',
      Last_Name: userEmployee?.Last_Name || currentUser?.name?.split(' ')[1] || '',
      Employee_Id: currentUser?.employeeId || currentUser?.userId || '',
      Leave_Type: 'Casual Leave',
      Start_Date: '',
      End_Date: '',
      Reason: '',
      status: 'Pending'
    });
    setShowModal(true);
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setFormData({ ...request });
    setShowModal(true);
  };

  const openViewModal = (request) => {
    setViewingRequest(request);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use current user's employee ID automatically
      const employeeId = currentUser?.employeeId || currentUser?.userId;
      
      const formattedData = {
        ...formData,
        Employee_Id: employeeId, // Always use current user's ID
        Start_Date: formData.Start_Date
          ? new Date(formData.Start_Date).toISOString().split("T")[0]
          : null,
        End_Date: formData.End_Date
          ? new Date(formData.End_Date).toISOString().split("T")[0]
          : null,
      };
  
      // Validation
      if (!employeeId) {
        alert("Employee ID not found. Please login again.");
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

      if (!formattedData.Leave_Type) {
        alert("Please select a leave type");
        setSaving(false);
        return;
      }
  
      const token = localStorage.getItem("token");
  
      let response;
      if (editingRequest) {
        // Update leave request
        response = await fetch(
          `http://localhost:3000/hr-leaves/${editingRequest.Leave_Id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedData),
          }
        );
      } else {
        // Add new leave request (Leave_Id will be auto-generated)
        response = await fetch("http://localhost:3000/hr-leaves", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        });
      }
  
      if (response.ok) {
        alert(
          editingRequest
            ? "Leave request updated successfully!"
            : "Leave request submitted successfully!"
        );
        await fetchLeaveRequests();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(
          `Failed: ${errorData.error || "Something went wrong, try again later"}`
        );
      }
    } catch (error) {
      console.error("Error saving leave request:", error);
      alert("Error saving leave request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/hr-leaves/${leaveId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Leave request deleted successfully!");
        await fetchLeaveRequests();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Error deleting leave request. Please try again.");
    }
  };

  const getEmployeeName = (employeeId, firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    const employee = employees.find(emp => emp.Employee_Id == employeeId);
    return employee ? `${employee.First_Name} ${employee.Last_Name}` : `Employee ${employeeId}`;
  };

  const calculateLeaveDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Check if current user can edit/delete a request
  const canEditDelete = (request) => {
    const userEmployeeId = currentUser?.employeeId || currentUser?.userId;
    return request.Employee_Id == userEmployeeId && request.status === 'Pending';
  };

  const filteredRequests = leaveRequests.filter(request => {
    const employeeName = getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name);
    const searchText = `${employeeName} ${request.Leave_Id || ''} ${request.Reason || ''} ${request.Leave_Type || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus = filterStatus === '' || request.status === filterStatus;
    const matchesEmployee = filterEmployee === '' || request.Employee_Id == filterEmployee;
    const matchesLeaveType = filterLeaveType === '' || request.Leave_Type === filterLeaveType;
    return matchesSearch && matchesStatus && matchesEmployee && matchesLeaveType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div 
      className="p-2 p-md-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <div 
        className="card mb-3 mb-md-4"
        style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(63, 226, 205, 0.1)"
        }}
      >
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-12 col-md-8 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <Calendar size={20} className="me-2 d-none d-md-inline" style={{ color: "#2c5f5d" }} />
                <div>
                  <h4 className="mb-0 fs-5 fs-md-4" style={{ color: "#2c5f5d" }}>My Leave Requests</h4>
                  <small className="text-muted">
                    Welcome, {currentUser?.name || 'User'}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 text-start text-md-end">
              <button 
                className="btn w-100 w-md-auto"
                style={{
                  background: "linear-gradient(45deg, #28a745, #20c997)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={openAddModal}
              >
                <Plus size={16} className="me-1" />
                Add Leave Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div 
        className="card mb-3 mb-md-4"
        style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px"
        }}
      >
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                    border: "1px solid rgba(63, 226, 205, 0.3)",
                    borderRadius: "8px"
                  }}
                />
              </div>
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={filterLeaveType}
                onChange={(e) => setFilterLeaveType(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Types</option>
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3 d-none d-md-block">
              <select
                className="form-select"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.Employee_Id} value={emp.Employee_Id}>
                    {emp.First_Name} {emp.Last_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="btn w-100"
                style={{
                  background: "linear-gradient(45deg, #6c757d, #495057)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={() => {
                  setSearch('');
                  setFilterStatus('');
                  setFilterEmployee('');
                  setFilterLeaveType('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {currentRequests.map((request) => (
          <div 
            key={request.Leave_Id}
            className="card mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1 fw-bold" style={{ color: "#2c5f5d" }}>
                    {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                  </h6>
                  <span 
                    className="badge px-2 py-1 me-2"
                    style={{ 
                      background: getLeaveTypeColor(request.Leave_Type),
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.7rem"
                    }}
                  >
                    {request.Leave_Type}
                  </span>
                </div>
                <span 
                  className="badge px-2 py-1"
                  style={{ 
                    background: getStatusColor(request.status),
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "0.7rem"
                  }}
                >
                  {getStatusIcon(request.status)} {request.status}
                </span>
              </div>
              
              <div className="mb-2">
                <small className="text-muted d-block">
                  <CalendarDays size={12} className="me-1" />
                  {new Date(request.Start_Date).toLocaleDateString()} - {new Date(request.End_Date).toLocaleDateString()}
                </small>
                <small className="text-muted d-block">
                  <Clock size={12} className="me-1" />
                  {calculateLeaveDays(request.Start_Date, request.End_Date)} days
                </small>
              </div>

              {request.Reason && (
                <p className="small mb-3 text-muted">
                  <FileText size={12} className="me-1" />
                  {request.Reason.length > 50 ? request.Reason.substring(0, 50) + '...' : request.Reason}
                </p>
              )}

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm flex-fill"
                  style={{
                    background: "linear-gradient(45deg, #17a2b8, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px"
                  }}
                  onClick={() => openViewModal(request)}
                >
                  <Eye size={14} />
                </button>
                {canEditDelete(request) && (
                  <>
                    <button 
                      className="btn btn-sm flex-fill"
                      style={{
                        background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px"
                      }}
                      onClick={() => openEditModal(request)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="btn btn-sm flex-fill"
                      style={{
                        background: "linear-gradient(45deg, #dc3545, #c82333)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px"
                      }}
                      onClick={() => handleDelete(request.Leave_Id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="d-none d-md-block">
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
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave Type</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Period</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Days</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
                    <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr key={request.Leave_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-4 py-3">
                        <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                          {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                        </div>
                        <small className="text-muted">ID: {request.Employee_Id}</small>
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            background: getLeaveTypeColor(request.Leave_Type),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem"
                          }}
                        >
                          {request.Leave_Type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                          <div>{new Date(request.Start_Date).toLocaleDateString()}</div>
                          <div>to {new Date(request.End_Date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        <span className="fw-bold">{calculateLeaveDays(request.Start_Date, request.End_Date)}</span> days
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
                            onClick={() => openViewModal(request)}
                          >
                            <Eye size={14} />
                          </button>
                          {canEditDelete(request) && (
                            <>
                              <button 
                                className="btn btn-sm"
                                style={{
                                  background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  width: "32px",
                                  height: "32px"
                                }}
                                onClick={() => openEditModal(request)}
                              >
                                <Edit3 size={14} />
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
                                onClick={() => handleDelete(request.Leave_Id)}
                              >
                                <Trash2 size={14} />
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination pagination-sm">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{
                    background: currentPage === 1 ? "#f8f9fa" : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: currentPage === 1 ? "#6c757d" : "white",
                    border: "1px solid rgba(63, 226, 205, 0.3)",
                    borderRadius: "6px 0 0 6px"
                  }}
                >
                  Prev
                </button>
              </li>
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }
                
                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        background: currentPage === pageNum 
                          ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                          : "white",
                        color: currentPage === pageNum ? "white" : "#2c5f5d",
                        border: "1px solid rgba(63, 226, 205, 0.3)"
                      }}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{
                    background: currentPage === totalPages ? "#f8f9fa" : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: currentPage === totalPages ? "#6c757d" : "white",
                    border: "1px solid rgba(63, 226, 205, 0.3)",
                    borderRadius: "0 6px 6px 0"
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
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
                <h5 className="modal-title fw-bold">
                  {editingRequest ? 'Edit Leave Request' : 'New Leave Request'}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                
                {/* Employee Info (Read-only for logged-in user) */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Employee
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${formData.First_Name} ${formData.Last_Name} (${formData.Employee_Id})`}
                        readOnly
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          background: "#f8f9fa"
                        }}
                      />
                      <small className="text-muted">Your employee information</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Calendar size={16} className="me-1" />
                        Leave Type *
                      </label>
                      <select
                        className="form-select"
                        name="Leave_Type"
                        value={formData.Leave_Type}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        {leaveTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="row mb-3">
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
                        value={formData.Start_Date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
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
                        <CalendarDays size={16} className="me-1" />
                        End Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="End_Date"
                        value={formData.End_Date}
                        onChange={handleChange}
                        required
                        min={formData.Start_Date || new Date().toISOString().split('T')[0]}
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

                {/* Days Calculation */}
                {formData.Start_Date && formData.End_Date && (
                  <div className="row mb-3">
                    <div className="col-12">
                      <div 
                        className="alert"
                        style={{
                          background: "rgba(63, 226, 205, 0.1)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px",
                          color: "#2c5f5d"
                        }}
                      >
                        <Clock size={16} className="me-2" />
                        <strong>Total Days:</strong> {calculateLeaveDays(formData.Start_Date, formData.End_Date)} days
                      </div>
                    </div>
                  </div>
                )}

                {/* Status (read-only) */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.status || "Pending"}
                        readOnly
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          background: "#f8f9fa"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <FileText size={16} className="me-1" />
                        Reason for Leave
                      </label>
                      <textarea
                        className="form-control"
                        name="Reason"
                        value={formData.Reason}
                        onChange={handleChange}
                        placeholder="Please provide the reason for your leave request..."
                        rows="4"
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                      <small className="text-muted">Optional but recommended</small>
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
                  onClick={() => setShowModal(false)}
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
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  {saving ? 'Submitting...' : (editingRequest ? 'Update Request' : 'Submit Request')}
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
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Employee
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getEmployeeName(viewingRequest.Employee_Id, viewingRequest.First_Name, viewingRequest.Last_Name)}
                        <br />
                        <small className="text-muted">ID: {viewingRequest.Employee_Id}</small>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Calendar size={16} className="me-1" />
                        Leave Type
                      </label>
                      <div className="p-2" style={{ 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            background: getLeaveTypeColor(viewingRequest.Leave_Type),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.875rem"
                          }}
                        >
                          {viewingRequest.Leave_Type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        Start Date
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRequest.Start_Date ? new Date(viewingRequest.Start_Date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        End Date
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRequest.End_Date ? new Date(viewingRequest.End_Date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Duration
                      </label>
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
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Status
                      </label>
                      <div className="p-2" style={{ 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            background: getStatusColor(viewingRequest.status),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.875rem"
                          }}
                        >
                          {getStatusIcon(viewingRequest.status)} {viewingRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <AlertCircle size={16} className="me-1" />
                        Request ID
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        #{viewingRequest.Leave_Id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <FileText size={16} className="me-1" />
                        Reason
                      </label>
                      <div className="p-3" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef",
                        minHeight: "80px"
                      }}>
                        {viewingRequest.Reason || 'No reason provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments section if available */}
                {viewingRequest.comments && (
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                          <MessageSquare size={16} className="me-1" />
                          Comments
                        </label>
                        <div className="p-3" style={{ 
                          color: "#5a6c6b", 
                          background: "#fff3cd",
                          borderRadius: "6px",
                          border: "1px solid #ffeaa7"
                        }}>
                          {viewingRequest.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

      {/* Empty State */}
      {currentRequests.length === 0 && (
        <div className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No leave requests found</h5>
          <p className="text-muted mb-4">
            {search || filterStatus || filterEmployee || filterLeaveType
              ? "Try adjusting your filters to see more results."
              : "You haven't submitted any leave requests yet."
            }
          </p>
          <button 
            className="btn"
            style={{
              background: "linear-gradient(45deg, #28a745, #20c997)",
              color: "white",
              border: "none",
              borderRadius: "8px"
            }}
            onClick={openAddModal}
          >
            <Plus size={16} className="me-1" />
            Add Your First Leave Request
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestTable;