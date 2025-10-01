import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit3, Trash2, Eye, 
  Download, Phone, Mail, Briefcase
} from 'lucide-react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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

  const openAddModal = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const openViewModal = (emp) => {
    setViewingEmployee(emp);
    setShowViewModal(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const formattedData = {
        ...formData,
        Join_Date: formData.Join_Date
          ? new Date(formData.Join_Date).toISOString().split("T")[0]
          : null,
        Date_Of_Birth: formData.Date_Of_Birth
          ? new Date(formData.Date_Of_Birth).toISOString().split("T")[0]
          : null,
        Resigned_Date: formData.Resigned_Date
          ? new Date(formData.Resigned_Date).toISOString().split("T")[0]
          : null,
        Department_Id: formData.Department_Id ? parseInt(formData.Department_Id) : null,
        Basic_Salary: formData.Basic_Salary ? parseFloat(formData.Basic_Salary) : null,
        Work_Experience: formData.Work_Experience ? parseFloat(formData.Work_Experience) : 0.0
      };

      const token = localStorage.getItem("token");
      const url = editingEmployee 
        ? `http://localhost:3000/employees/${editingEmployee.Employee_Id}`
        : 'http://localhost:3000/employees';
      
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok) {
        if (!editingEmployee && result.emailSent) {
          alert(`Employee added successfully!\n\nWelcome email has been sent to ${formattedData.Email} with setup instructions.`);
        } else if (!editingEmployee && !result.emailSent) {
          alert(`Employee added successfully!\n\nHowever, the welcome email could not be sent. Please manually send credentials to ${formattedData.Email}`);
        } else {
          alert("Employee updated successfully!");
        }
        
        await fetchEmployees();
        setShowModal(false);
        return result;
      } else {
        alert(`Failed to save employee: ${result.error || result.message || "Unknown error"}`);
        return null;
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Error saving employee. Please check your internet connection and try again.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        alert("Employee deleted successfully!");
        await fetchEmployees();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete employee: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee. Please try again.");
    }
  };

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

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div 
      className="p-2 p-md-3 p-lg-4"
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
          <div className="row align-items-center g-2">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div className="d-flex align-items-center">
                <Users size={18} className="me-2 d-none d-md-inline" style={{ color: "#2c5f5d" }} />
                <h5 className="mb-0" style={{ color: "#2c5f5d", fontSize: '0.95rem' }}>Employee Management</h5>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                <button 
                  className="btn btn-sm flex-fill flex-sm-grow-0"
                  style={{
                    background: "linear-gradient(45deg, #28a745, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.8rem'
                  }}
                  onClick={openAddModal}
                >
                  <Plus size={14} className="me-1" />
                  Add
                </button>
                <button 
                  className="btn btn-sm flex-fill flex-sm-grow-0"
                  style={{
                    background: "linear-gradient(45deg, #17a2b8, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.8rem'
                  }}
                >
                  <Download size={14} className="me-1" />
                  Export
                </button>
              </div>
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
            <div className="col-12 col-md-4">
              <div className="position-relative">
                <Search size={14} className="position-absolute top-50 start-0 translate-middle-y ms-2" style={{ color: "#2c5f5d" }} />
                <input
                  type="text"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                    border: "1px solid rgba(63, 226, 205, 0.3)",
                    borderRadius: "8px",
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px",
                  fontSize: '0.8rem'
                }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px",
                  fontSize: '0.8rem'
                }}
              >
                <option value="">All Designations</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button 
                className="btn btn-sm w-100"
                style={{
                  background: "linear-gradient(45deg, #6c757d, #495057)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem'
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

      {/* Mobile Cards */}
      <div className="d-md-none">
        {currentEmployees.map((emp) => (
          <div 
            key={emp.Employee_Id}
            className="card mb-2"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0" style={{ color: "#2c5f5d", fontSize: '0.85rem' }}>
                  {emp.First_Name} {emp.Last_Name}
                </h6>
                <span 
                  className="badge bg-primary"
                  style={{ borderRadius: "20px", fontSize: '0.65rem' }}
                >
                  {emp.Employee_Id}
                </span>
              </div>
              <p className="mb-1" style={{ color: "#5a6c6b", fontSize: '0.75rem' }}>
                <Briefcase size={12} className="me-1" />
                {emp.Designation}
              </p>
              <p className="mb-1" style={{ color: "#5a6c6b", fontSize: '0.75rem' }}>
                <Mail size={12} className="me-1" />
                {emp.Email}
              </p>
              <p className="mb-3" style={{ color: "#5a6c6b", fontSize: '0.75rem' }}>
                <Phone size={12} className="me-1" />
                {emp.Phone}
              </p>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm flex-fill"
                  style={{
                    background: "linear-gradient(45deg, #17a2b8, #20c997)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: '0.35rem 0.5rem'
                  }}
                  onClick={() => openViewModal(emp)}
                >
                  <Eye size={12} />
                </button>
                <button 
                  className="btn btn-sm flex-fill"
                  style={{
                    background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: '0.35rem 0.5rem'
                  }}
                  onClick={() => openEditModal(emp)}
                >
                  <Edit3 size={12} />
                </button>
                <button 
                  className="btn btn-sm flex-fill"
                  style={{
                    background: "linear-gradient(45deg, #dc3545, #c82333)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: '0.35rem 0.5rem'
                  }}
                  onClick={() => handleDelete(emp.Employee_Id)}
                >
                  <Trash2 size={12} />
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
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Employee</th>
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>ID</th>
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Contact</th>
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Department</th>
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Join Date</th>
                    <th className="border-0 px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Salary</th>
                    <th className="border-0 px-3 py-2 text-center" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((emp) => (
                    <tr key={emp.Employee_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-3 py-2">
                        <div>
                          <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: '0.8rem' }}>
                            {emp.First_Name} {emp.Last_Name}
                          </div>
                          <small style={{ color: "#5a6c6b", fontSize: '0.7rem' }}>{emp.Designation}</small>
                        </div>
                      </td>
                      <td className="px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>{emp.Employee_Id}</td>
                      <td className="px-3 py-2">
                        <div style={{ color: "#5a6c6b", fontSize: '0.72rem' }}>
                          <div className="mb-1">{emp.Email}</div>
                          <div>{emp.Phone}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>
                        {getDepartmentName(emp.Department_Id)}
                      </td>
                      <td className="px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>
                        {emp.Join_Date ? new Date(emp.Join_Date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-2" style={{ color: "#2c5f5d", fontSize: '0.75rem' }}>
                        {emp.Basic_Salary ? `₹${parseInt(emp.Basic_Salary).toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          <button 
                            className="btn btn-sm"
                            style={{
                              background: "linear-gradient(45deg, #17a2b8, #20c997)",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              width: "28px",
                              height: "28px",
                              padding: '0'
                            }}
                            onClick={() => openViewModal(emp)}
                          >
                            <Eye size={12} />
                          </button>
                          <button 
                            className="btn btn-sm"
                            style={{
                              background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              width: "28px",
                              height: "28px",
                              padding: '0'
                            }}
                            onClick={() => openEditModal(emp)}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button 
                            className="btn btn-sm"
                            style={{
                              background: "linear-gradient(45deg, #dc3545, #c82333)",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              width: "28px",
                              height: "28px",
                              padding: '0'
                            }}
                            onClick={() => handleDelete(emp.Employee_Id)}
                          >
                            <Trash2 size={12} />
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
        <div className="d-flex justify-content-center mt-3 mt-md-4">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{
                    background: currentPage === 1 ? "#f8f9fa" : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: currentPage === 1 ? "#6c757d" : "white",
                    border: "1px solid rgba(63, 226, 205, 0.3)",
                    borderRadius: "6px 0 0 6px",
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem'
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
                        border: "1px solid rgba(63, 226, 205, 0.3)",
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.65rem'
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
                    borderRadius: "0 6px 6px 0",
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem'
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Empty State */}
      {currentEmployees.length === 0 && (
        <div className="text-center py-5">
          <Users size={40} className="text-muted mb-3" />
          <h6 className="text-muted" style={{ fontSize: '0.9rem' }}>No employees found</h6>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            {search || filterDepartment || filterDesignation
              ? "Try adjusting your filters"
              : "Add your first employee to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;