import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Phone, Mail, 
  Calendar, User, IdCard, Briefcase, MapPin,
  DollarSign, Building2, Image
} from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);
  
      const response = await fetch("http://localhost:3000/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    Employee_Id: '',
    First_Name: '',
    Last_Name: '',
    Email: '',
    Phone: '',
    Address: '',
    Join_Date: '',
    Designation: '',
    Basic_Salary: '',
    Department_Id: '',
    Image_Path: ''
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "employeeTable.xlsx");
  };

  // FIXED: Changed department IDs to match database (integer values)
  const departments = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Operations' }
  ];

  const designations = [
    'Software Engineer',
    'Senior Software Engineer',
    'HR Manager',
    'HR Executive',
    'Marketing Manager',
    'Marketing Executive',
    'Finance Manager',
    'Accountant',
    'Operations Manager',
    'Team Lead',
    'Project Manager'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      Employee_Id: '',
      First_Name: '',
      Last_Name: '',
      Email: '',
      Phone: '',
      Address: '',
      Join_Date: '',
      Designation: '',
      Basic_Salary: '',
      Department_Id: '',
      Image_Path: ''
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setShowModal(true);
  };

  const openViewModal = (emp) => {
    setViewingEmployee(emp);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Format data properly
      const formattedData = {
        ...formData,
        Join_Date: formData.Join_Date
          ? new Date(formData.Join_Date).toISOString().split("T")[0]
          : null,
        Department_Id: formData.Department_Id ? parseInt(formData.Department_Id) : null,
        Basic_Salary: formData.Basic_Salary ? parseFloat(formData.Basic_Salary) : null
      };

      // FIXED: Added validation for Department_Id
      if (!formattedData.Department_Id) {
        alert("Please select a department");
        setSaving(false);
        return;
      }

      console.log("Sending data:", formattedData);
      console.log("Department_Id value:", formattedData.Department_Id, typeof formattedData.Department_Id);
  
      const token = localStorage.getItem("token");
  
      if (editingEmployee) {
        const response = await fetch(
          `http://localhost:3000/employees/${editingEmployee.Employee_Id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedData),
          }
        );
  
        if (response.ok) {
          alert("Employee updated successfully!");
          await fetchEmployees();
          setShowModal(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to update employee: ${errorData.error || "Unknown error"}`);
        }
      } else {
        const response = await fetch("http://localhost:3000/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        });
  
        if (response.ok) {
          alert("Employee added successfully!");
          await fetchEmployees();
          setShowModal(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to add employee: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Error saving employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Get token from storage
  
      if (!token) {
        alert("You are not logged in.");
        return;
      }
  
      const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- send token here
        }
      });
  
      if (response.ok) {
        console.log("Employee deleted successfully!");
        alert("Employee deleted successfully!");
        await fetchEmployees();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Failed to delete employee:", errorData);
          alert(`Failed to delete employee: ${errorData.message || 'Unknown error'}`);
        } else {
          console.error("Failed to delete employee. Server responded with a non-JSON error.");
          alert(`Failed to delete employee: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee. Please try again. Check server connection.");
    }
  };
  

  // FIXED: Updated getDepartmentName to use integer IDs
  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id == deptId);
    return dept ? dept.name : `Dept ${deptId}`;
  };

  const filteredEmployees = employees.filter(emp => {
    const searchText = `${emp.First_Name || ''} ${emp.Last_Name || ''} ${emp.Employee_Id || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesDepartment = filterDepartment === '' || emp.Department_Id == filterDepartment;
    const matchesDesignation = filterDesignation === '' || emp.Designation === filterDesignation;
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

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
                <Users size={24} className="me-2" style={{ color: "#2c5f5d" }} />
                <h4 className="mb-0" style={{ color: "#2c5f5d" }}>Employee Management</h4>
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
                Add Employee
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
                  placeholder="Search employees..."
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
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Designations</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
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
                  setFilterDepartment('');
                  setFilterDesignation('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards for Mobile */}
      <div className="d-md-none">
        {currentEmployees.map((emp) => (
          <div 
            key={emp.Employee_Id}
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
                  {emp.First_Name} {emp.Last_Name}
                </h6>
                <span 
                  className="badge bg-primary"
                  style={{ borderRadius: "20px" }}
                >
                  {emp.Employee_Id}
                </span>
              </div>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <Briefcase size={14} className="me-1" />
                {emp.Designation}
              </p>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <Mail size={14} className="me-1" />
                {emp.Email}
              </p>
              <p className="small mb-3" style={{ color: "#5a6c6b" }}>
                <Phone size={14} className="me-1" />
                {emp.Phone}
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
                  onClick={() => openViewModal(emp)}
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
                  onClick={() => openEditModal(emp)}
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
                  onClick={() => handleDelete(emp.Employee_Id)}
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
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>ID</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Contact</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Department</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Join Date</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Salary</th>
                    <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((emp) => (
                    <tr key={emp.Employee_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                            {emp.First_Name} {emp.Last_Name}
                          </div>
                          <small style={{ color: "#5a6c6b" }}>{emp.Designation}</small>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{emp.Employee_Id}</td>
                      <td className="px-4 py-3">
                        <div style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                          <div className="mb-1">{emp.Email}</div>
                          <div>{emp.Phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {getDepartmentName(emp.Department_Id)}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {emp.Join_Date ? new Date(emp.Join_Date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {emp.Basic_Salary ? `₹${parseInt(emp.Basic_Salary).toLocaleString()}` : 'N/A'}
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
                            onClick={() => openViewModal(emp)}
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
                            onClick={() => openEditModal(emp)}
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
                            onClick={() => handleDelete(emp.Employee_Id)}
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
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
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
                        <IdCard size={16} className="me-1" />
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Employee_Id"
                        value={formData.Employee_Id}
                        onChange={handleChange}
                        placeholder="Enter Employee ID"
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
                        <User size={16} className="me-1" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="First_Name"
                        value={formData.First_Name}
                        onChange={handleChange}
                        placeholder="Enter First Name"
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
                        <User size={16} className="me-1" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Last_Name"
                        value={formData.Last_Name}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
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
                        <Mail size={16} className="me-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        placeholder="Enter Email Address"
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
                        <Phone size={16} className="me-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="Phone"
                        value={formData.Phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
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
                        <MapPin size={16} className="me-1" />
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        placeholder="Enter Address"
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
                        <Calendar size={16} className="me-1" />
                        Join Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="Join_Date"
                        value={formData.Join_Date}
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
                        <Briefcase size={16} className="me-1" />
                        Designation *
                      </label>
                      <select
                        className="form-select"
                        name="Designation"
                        value={formData.Designation}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        <option value="">Select Designation</option>
                        {designations.map(designation => (
                          <option key={designation} value={designation}>{designation}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <DollarSign size={16} className="me-1" />
                        Basic Salary
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Basic_Salary"
                        value={formData.Basic_Salary}
                        onChange={handleChange}
                        placeholder="Enter Basic Salary"
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
                        <Building2 size={16} className="me-1" />
                        Department *
                      </label>
                      <select
                        className="form-select"
                        name="Department_Id"
                        value={formData.Department_Id}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Image size={16} className="me-1" />
                        Image Path
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Image_Path"
                        value={formData.Image_Path}
                        onChange={handleChange}
                        placeholder="Enter Image URL or Path"
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
                  {saving ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Save Employee')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingEmployee && (
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
                  Employee Details
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                {viewingEmployee.Image_Path && (
                  <div className="text-center mb-4">
                    <img 
                      src={viewingEmployee.Image_Path} 
                      alt="Employee" 
                      className="rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #3fe2cd"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <IdCard size={16} className="me-1" />
                        Employee ID
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Employee_Id || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <User size={16} className="me-1" />
                        Full Name
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.First_Name} {viewingEmployee.Last_Name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Mail size={16} className="me-1" />
                        Email
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Phone size={16} className="me-1" />
                        Phone
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <MapPin size={16} className="me-1" />
                        Address
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Calendar size={16} className="me-1" />
                        Join Date
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Join_Date ? new Date(viewingEmployee.Join_Date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Briefcase size={16} className="me-1" />
                        Designation
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Designation || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Building2 size={16} className="me-1" />
                        Department
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getDepartmentName(viewingEmployee.Department_Id)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <DollarSign size={16} className="me-1" />
                        Basic Salary
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingEmployee.Basic_Salary ? `₹${parseInt(viewingEmployee.Basic_Salary).toLocaleString()}` : 'N/A'}
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

export default EmployeeTable;