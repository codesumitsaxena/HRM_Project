import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Clock, CheckCircle, 
  XCircle, User, FileText, CalendarDays, AlertCircle,
  Building2, Users
} from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const HRLeaveRequestTable = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, []);
  
  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);
  
      const response = await fetch("http://localhost:3000/leaves", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch leaves`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
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
      console.log("Employees API Response:", data);
  
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    Leave_Id: '',
    First_Name: '',
    Last_Name: '',
    Employee_Id: '',
    Start_Date: '',
    End_Date: '',
    Reason: '',
    status: 'Pending'
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaveRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "leaveRequestsTable.xlsx");
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If Employee_Id changes, update First_Name and Last_Name
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
    setFormData({
      Leave_Id: '',
      First_Name: '',
      Last_Name: '',
      Employee_Id: '',
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
      // Format data properly
      const formattedData = {
        ...formData,
        Start_Date: formData.Start_Date
          ? new Date(formData.Start_Date).toISOString().split("T")[0]
          : null,
        End_Date: formData.End_Date
          ? new Date(formData.End_Date).toISOString().split("T")[0]
          : null,
        Employee_Id: formData.Employee_Id ? parseInt(formData.Employee_Id) : null,
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
  
      console.log("Sending data:", formattedData);
  
      // JWT token
      const token = localStorage.getItem("token");
  
      let response;
      if (editingRequest) {
        // Update leave request
        response = await fetch(
          `http://localhost:3000/leaves/${editingRequest.Leave_Id}`,
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
        // Add new leave request
        response = await fetch("http://localhost:3000/leaves", {
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
            : "Leave request added successfully!"
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
  
      if (!token) {
        alert("You are not logged in.");
        return;
      }
  
      const response = await fetch(`http://localhost:3000/leaves/${leaveId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log("Leave request deleted successfully!");
        alert("Leave request deleted successfully!");
        await fetchLeaveRequests(); // refresh table
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Failed to delete leave request:", errorData);
          alert(
            `Failed to delete leave request: ${
              errorData.message || "Unknown error"
            }`
          );
        } else {
          console.error(
            "Failed to delete leave request. Server responded with a non-JSON error."
          );
          alert(
            `Failed to delete leave request: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Error deleting leave request. Please try again. Check server connection.");
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

  const filteredRequests = leaveRequests.filter(request => {
    const employeeName = getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name);
    const searchText = `${employeeName} ${request.Leave_Id || ''} ${request.Reason || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus = filterStatus === '' || request.status === filterStatus;
    const matchesEmployee = filterEmployee === '' || request.Employee_Id == filterEmployee;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <Calendar size={24} className="me-2" style={{ color: "#2c5f5d" }} />
                <h4 className="mb-0" style={{ color: "#2c5f5d" }}>Leave Request Management</h4>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <button 
                className="btn me-2"
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
              <button 
                className="btn me-2"
                style={{
                  background: "linear-gradient(45deg, #17a2b8, #20c997)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={exportToExcel} 
              >
                <Download size={16} className="me-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div 
        className="card mb-4"
        style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "12px"
        }}
      >
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: "#2c5f5d" }} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search leave requests..."
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
            <div className="col-md-3 mb-3">
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
            <div className="col-md-3 mb-3">
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
                    {emp.First_Name} {emp.Last_Name} ({emp.Employee_Id})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-3">
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
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Cards for Mobile */}
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
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                  {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                </h6>
                <span 
                  className="badge"
                  style={{ 
                    background: getStatusColor(request.status),
                    color: "white",
                    borderRadius: "20px"
                  }}
                >
                  {getStatusIcon(request.status)} {request.status}
                </span>
              </div>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <CalendarDays size={14} className="me-1" />
                {new Date(request.Start_Date).toLocaleDateString()} - {new Date(request.End_Date).toLocaleDateString()}
              </p>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <Clock size={14} className="me-1" />
                {calculateLeaveDays(request.Start_Date, request.End_Date)} days
              </p>
              <p className="small mb-3" style={{ color: "#5a6c6b" }}>
                <FileText size={14} className="me-1" />
                {request.Reason ? (request.Reason.length > 30 ? request.Reason.substring(0, 30) + '...' : request.Reason) : 'N/A'}
              </p>
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
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave ID</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Leave Period</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Days</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Reason</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
                    <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr key={request.Leave_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{request.Leave_Id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                            {getEmployeeName(request.Employee_Id, request.First_Name, request.Last_Name)}
                          </div>
                          <small style={{ color: "#5a6c6b" }}>ID: {request.Employee_Id}</small>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                          <div className="mb-1">From: {new Date(request.Start_Date).toLocaleDateString()}</div>
                          <div>To: {new Date(request.End_Date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {calculateLeaveDays(request.Start_Date, request.End_Date)} days
                      </td>
                      <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>
                        {request.Reason ? (request.Reason.length > 30 ? request.Reason.substring(0, 30) + '...' : request.Reason) : 'N/A'}
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
            <ul className="pagination">
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
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                    style={{
                      background: currentPage === index + 1 
                        ? "linear-gradient(45deg, #3fe2cd, #2c5f5d)" 
                        : "white",
                      color: currentPage === index + 1 ? "white" : "#2c5f5d",
                      border: "1px solid rgba(63, 226, 205, 0.3)"
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
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
                  {editingRequest ? 'Edit Leave Request' : 'Add New Leave Request'}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <AlertCircle size={16} className="me-1" />
                        Leave ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Leave_Id"
                        value={formData.Leave_Id}
                        onChange={handleChange}
                        placeholder="Auto-generated if empty"
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
                        <Users size={16} className="me-1" />
                        Employee *
                      </label>
                      <select
                        className="form-select"
                        name="Employee_Id"
                        value={formData.Employee_Id}
                        onChange={handleChange}
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
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <User size={16} className="me-1" />
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="First_Name"
                        value={formData.First_Name}
                        onChange={handleChange}
                        placeholder="First Name (auto-filled)"
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
                        <User size={16} className="me-1" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Last_Name"
                        value={formData.Last_Name}
                        onChange={handleChange}
                        placeholder="Last Name (auto-filled)"
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
                        Start Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="Start_Date"
                        value={formData.Start_Date}
                        onChange={handleChange}
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
                <div className="col-md-6">
  <div className="mb-3">
    <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
      <Clock size={16} className="me-1" />
      Status *
    </label>
    <input
      type="text"
      className="form-control"
      value="Pending"
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

                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <FileText size={16} className="me-1" />
                        Reason
                      </label>
                      <textarea
                        className="form-control"
                        name="Reason"
                        value={formData.Reason}
                        onChange={handleChange}
                        placeholder="Enter reason for leave"
                        rows="4"
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
                  {saving ? 'Saving...' : (editingRequest ? 'Update Request' : 'Save Request')}
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
                <h5 className="modal-title fw-bold">
                  Leave Request Details
                </h5>
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
                        <AlertCircle size={16} className="me-1" />
                        Leave ID
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRequest.Leave_Id || 'N/A'}
                      </p>
                    </div>
                  </div>
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
                        {getEmployeeName(viewingRequest.Employee_Id, viewingRequest.First_Name, viewingRequest.Last_Name)} ({viewingRequest.Employee_Id})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Total Days
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
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <FileText size={16} className="me-1" />
                        Reason
                      </label>
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
    </div>
  );
};

export default HRLeaveRequestTable;