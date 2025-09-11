import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Phone, Mail, 
  Calendar, User, IdCard, Briefcase 
} from 'lucide-react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []); // [] => run only once when component mounts

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_id: '',
    phone: '',
    join_date: '',
    role: '',
    email: '',
    department: '',
    salary: '',
    status: 'Active'
  });

  const departments = ['IT', 'HR', 'Marketing', 'Finance', 'Operations'];
  const roles = ['Software Engineer', 'HR Manager', 'Marketing Specialist', 'Accountant', 'Manager'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      employee_id: '',
      phone: '',
      join_date: '',
      role: '',
      email: '',
      department: '',
      salary: '',
      status: 'Active'
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

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { ...formData, id: editingEmployee.id } : emp
      ));
    } else {
      const newEmployee = { ...formData, id: Date.now() };
      setEmployees([...employees, newEmployee]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.first_name} ${emp.last_name} ${emp.employee_id}`.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = filterDepartment === '' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === '' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
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
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                  setFilterStatus('');
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
            key={emp.id}
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
                  {emp.first_name} {emp.last_name}
                </h6>
                <span 
                  className={`badge ${emp.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                  style={{ borderRadius: "20px" }}
                >
                  {emp.status}
                </span>
              </div>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <IdCard size={14} className="me-1" />
                {emp.employee_id} | {emp.role}
              </p>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <Mail size={14} className="me-1" />
                {emp.email}
              </p>
              <p className="small mb-3" style={{ color: "#5a6c6b" }}>
                <Phone size={14} className="me-1" />
                {emp.phone}
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
                  onClick={() => handleDelete(emp.id)}
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
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Address</th>
                    <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((emp) => (
                    <tr key={emp.id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                            {emp.First_Name} {emp.Last_Name}
                          </div>
                          <small style={{ color: "#5a6c6b" }}>{emp.role}</small>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{emp.Employee_Id}</td>
                      <td className="px-4 py-3">
                        <div style={{ color: "#5a6c6b", fontSize: "0.875rem" }}>
                          <div className="mb-1">{emp.Email}</div>
                          <div>{emp.Phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{emp.Designation}</td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {new Date(emp.Join_Date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}> {emp.Address}</td>
                      
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
                            onClick={() => handleDelete(emp.id)}
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div 
              className="modal-content"
              style={{
                background: "linear-gradient(135deg, #ffffff95, #3fe2cd08)",
                border: "1px solid rgba(63, 226, 205, 0.2)",
                borderRadius: "12px"
              }}
            >
              <div 
                className="modal-header border-0"
                style={{
                  background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
                  borderRadius: "12px 12px 0 0"
                }}
              >
                <h5 className="modal-title" style={{ color: "#2c5f5d" }}>
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h5>
                <button 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <User size={16} className="me-1" />
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <User size={16} className="me-1" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <IdCard size={16} className="me-1" />
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <Phone size={16} className="me-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <Calendar size={16} className="me-1" />
                        Join Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="join_date"
                        value={formData.join_date}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <Briefcase size={16} className="me-1" />
                        Role
                      </label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        <Mail size={16} className="me-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        Department
                      </label>
                      <select
                        className="form-select"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        Salary
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" style={{ color: "#2c5f5d" }}>
                        Address
                      </label>
                      <select
                        className="form-select"
                        name="Address"
                        value={formData.status}
                        onChange={handleChange}
                        style={{
                          background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                          border: "1px solid rgba(63, 226, 205, 0.3)",
                          borderRadius: "8px"
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  className="btn"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "linear-gradient(45deg, #6c757d, #495057)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px"
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn ms-2"
                  onClick={handleSave}
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px"
                  }}
                >
                  {editingEmployee ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div 
              className="modal-content"
              style={{
                background: "linear-gradient(135deg, #ffffff95, #3fe2cd08)",
                border: "1px solid rgba(63, 226, 205, 0.2)",
                borderRadius: "12px"
              }}
            >
              <div 
                className="modal-header border-0"
                style={{
                  background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
                  borderRadius: "12px 12px 0 0"
                }}
              >
                <h5 className="modal-title" style={{ color: "#2c5f5d" }}>
                  Employee Details
                </h5>
                <button 
                  className="btn-close" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <User size={16} className="me-1" />
                        Full Name
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.first_name} {viewingEmployee.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CreditCard size={16} className="me-1" />
                        Employee ID
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.employee_id}
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
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.email}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Phone size={16} className="me-1" />
                        Phone
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Briefcase size={16} className="me-1" />
                        Role
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.role}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        Department
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {viewingEmployee.department}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Calendar size={16} className="me-1" />
                        Join Date
                      </label>
                      <p className="mb-0" style={{ color: "#5a6c6b" }}>
                        {new Date(viewingEmployee.join_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        Status
                      </label>
                      <p className="mb-0">
                        <span 
                          className={`badge ${viewingEmployee.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                          style={{ borderRadius: "20px" }}
                        >
                          {viewingEmployee.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {viewingEmployee.salary && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                          Salary
                        </label>
                        <p className="mb-0" style={{ color: "#5a6c6b" }}>
                          ₹{viewingEmployee.salary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button 
                  className="btn"
                  onClick={() => setShowViewModal(false)}
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px"
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