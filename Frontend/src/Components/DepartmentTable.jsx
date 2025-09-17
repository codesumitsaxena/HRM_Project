import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, Users, 
  Calendar, IdCard, Hash, AlertCircle, CheckCircle
} from 'lucide-react';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Predefined department names
  const allDepartmentNames = ['IT', 'HR', 'Marketing', 'Finance', 'Operations'];

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch("http://localhost:3000/departments");
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError("Error fetching departments: " + err.message);
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [filterEmployeeRange, setFilterEmployeeRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    Dept_Id: '',
    Department_Name: '',
    Department_Head: '',
    Department_Total_Employee: ''
  });

  const employeeRanges = [
    '1-10',
    '11-25',
    '26-50',
    '51-100',
    '100+'
  ];

  // Get available department names (exclude already existing ones)
  const getAvailableDepartmentNames = () => {
    const existingNames = departments.map(dept => dept.Department_Name);
    // If editing, allow the current department's name to be selected
    if (editingDepartment) {
      return allDepartmentNames.filter(name => 
        name === editingDepartment.Department_Name || !existingNames.includes(name)
      );
    }
    // For new departments, only show names that don't exist yet
    return allDepartmentNames.filter(name => !existingNames.includes(name));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    setFormData({
      Dept_Id: '',
      Department_Name: '',
      Department_Head: '',
      Department_Total_Employee: ''
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDepartment(dept);
    setFormData({ ...dept });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openViewModal = (dept) => {
    setViewingDepartment(dept);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.Dept_Id || !formData.Department_Name) {
      setError('Please fill in all required fields (Department ID and Name)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (editingDepartment) {
        // Update existing department
        response = await fetch(`http://localhost:3000/departments/${editingDepartment.Dept_Id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new department
        response = await fetch('http://localhost:3000/departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save department');
      }

      const savedDepartment = await response.json();
      
      if (editingDepartment) {
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? savedDepartment : dept
        ));
        setSuccess('Department updated successfully!');
      } else {
        setDepartments([...departments, savedDepartment]);
        setSuccess('Department created successfully!');
      }

      setShowModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Error saving department: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (Dept_Id, deptName) => {
    if (window.confirm(`Are you sure you want to delete the department "${deptName}"?`)) {
      setLoading(true);
      setError('');
  
      try {
        const response = await fetch(`http://localhost:3000/departments/${Dept_Id}`, {
          method: "DELETE",
        });
  
        // Check if the response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json(); // ✅ Parse the JSON response
          if (!response.ok) {
            throw new Error(errorData.message || 'Failed to delete department');
          }
        } else {
          // Handle non-JSON responses (e.g., from a 404 page)
          if (!response.ok) {
            throw new Error('Failed to delete department: ' + response.statusText);
          }
        }
  
        setDepartments(departments.filter(dept => dept.Dept_Id !== Dept_Id));
        setSuccess('Department deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
  
      } catch (err) {
        // ✅ Now this will show the specific error from the backend
        setError('Error deleting department: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Department ID', 'Department Name', 'Total Employees', 'Department_Head'].join(','),
      ...filteredDepartments.map(dept => [
        dept.Dept_Id || '',
        dept.Department_Name || '',
        dept.Department_Total_Employee || 0,
        getEmployeeRangeFilter(dept.Department_Total_Employee) || 'Not Set'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'departments_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEmployeeRangeFilter = (totalEmployees) => {
    const count = parseInt(totalEmployees) || 0;
    if (count >= 1 && count <= 10) return '1-10';
    if (count >= 11 && count <= 25) return '11-25';
    if (count >= 26 && count <= 50) return '26-50';
    if (count >= 51 && count <= 100) return '51-100';
    if (count > 100) return '100+';
    return '';
  };

  const filteredDepartments = departments.filter(dept => {
    const searchText = `${dept.Department_Name || ''} ${dept.Dept_Id || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesEmployeeRange = filterEmployeeRange === '' || 
      getEmployeeRangeFilter(dept.Department_Total_Employee) === filterEmployeeRange;
    return matchesSearch && matchesEmployeeRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div 
      className="p-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
      {/* Success/Error Messages */}
      {success && (
        <div 
          className="alert alert-success d-flex align-items-center mb-4"
          style={{
            background: "linear-gradient(45deg, #d4edda, #c3e6cb)",
            border: "1px solid #28a745",
            borderRadius: "8px"
          }}
        >
          <CheckCircle size={20} className="me-2" />
          {success}
        </div>
      )}

      {error && (
        <div 
          className="alert alert-danger d-flex align-items-center mb-4"
          style={{
            background: "linear-gradient(45deg, #f8d7da, #f5c6cb)",
            border: "1px solid #dc3545",
            borderRadius: "8px"
          }}
        >
          <AlertCircle size={20} className="me-2" />
          {error}
        </div>
      )}

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
                <Building2 size={24} className="me-2" style={{ color: "#2c5f5d" }} />
                <div>
                  <h4 className="mb-0" style={{ color: "#2c5f5d" }}>Department Management</h4>
                  <small className="text-muted">Total: {departments.length} departments</small>
                </div>
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
                disabled={loading}
              >
                <Plus size={16} className="me-1" />
                Add Department
              </button>
              <button 
                className="btn me-2"
                style={{
                  background: "linear-gradient(45deg, #17a2b8, #20c997)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={handleExport}
                disabled={loading || departments.length === 0}
              >
                <Download size={16} className="me-1" />
                Export CSV
              </button>
              <button 
                className="btn"
                style={{
                  background: "linear-gradient(45deg, #6f42c1, #495057)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
                onClick={fetchDepartments}
                disabled={loading}
              >
                <Upload size={16} className="me-1" />
                {loading ? 'Loading...' : 'Refresh'}
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
            <div className="col-md-6 mb-3">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: "#2c5f5d" }} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search departments by name or ID..."
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
            <div className="col-md-4 mb-3">
              <select
                className="form-select"
                value={filterEmployeeRange}
                onChange={(e) => setFilterEmployeeRange(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Employee Ranges</option>
                {employeeRanges.map(range => (
                  <option key={range} value={range}>{range} Employees</option>
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
                  setFilterEmployeeRange('');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          {filteredDepartments.length !== departments.length && (
            <div className="mt-2">
              <small className="text-muted">
                Showing {filteredDepartments.length} of {departments.length} departments
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#3fe2cd" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: "#2c5f5d" }}>Loading departments...</p>
        </div>
      )}

      {/* No Data State */}
      {!loading && departments.length === 0 && (
        <div 
          className="card text-center py-5"
          style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "12px"
          }}
        >
          <div className="card-body">
            <Building2 size={48} style={{ color: "#3fe2cd" }} />
            <h5 className="mt-3" style={{ color: "#2c5f5d" }}>No Departments Found</h5>
            <p className="text-muted">Start by adding your first department</p>
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
              Add First Department
            </button>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {!loading && departments.length > 0 && filteredDepartments.length === 0 && (
        <div 
          className="card text-center py-5"
          style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "12px"
          }}
        >
          <div className="card-body">
            <Search size={48} style={{ color: "#3fe2cd" }} />
            <h5 className="mt-3" style={{ color: "#2c5f5d" }}>No Results Found</h5>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
            <button 
              className="btn"
              style={{
                background: "linear-gradient(45deg, #6c757d, #495057)",
                color: "white",
                border: "none",
                borderRadius: "8px"
              }}
              onClick={() => {
                setSearch('');
                setFilterEmployeeRange('');
                setCurrentPage(1);
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Department Cards for Mobile */}
      {!loading && currentDepartments.length > 0 && (
        <div className="d-md-none">
          {currentDepartments.map((dept) => (
            <div 
              key={dept.id}
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
                    {dept.Department_Name}
                  </h6>
                  <span 
                    className="badge bg-primary"
                    style={{ borderRadius: "20px" }}
                  >
                    {dept.Dept_Id}
                  </span>
                </div>
                <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                  <Users size={14} className="me-1" />
                  Total Employees: {dept.Department_Total_Employee || 0}
                </p>
                <p className="small mb-3" style={{ color: "#5a6c6b" }}>
                  <Hash size={14} className="me-1" />
                  Range: {getEmployeeRangeFilter(dept.Department_Total_Employee) || 'Not Set'}
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
                    onClick={() => openViewModal(dept)}
                    disabled={loading}
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
                    onClick={() => openEditModal(dept)}
                    disabled={loading}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
  className="btn btn-sm flex-fill"
  style={{
    background: "linear-gradient(45deg, #dc3545, #c82333)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: loading ? "not-allowed" : "pointer"
  }}
  onClick={() => handleDelete(dept.Dept_Id, dept.Department_Name)}
  disabled={loading}
>
  <Trash2 size={14} />
</button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && currentDepartments.length > 0 && (
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
                      <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Department ID</th>
                      <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Department Name</th>
                      <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Department Head</th>
                      <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Total Employees</th>
                      <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDepartments.map((dept) => (
                      <tr key={dept.id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                        <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                          <div className="d-flex align-items-center">
                            <Building2 size={16} className="me-2" style={{ color: "#3fe2cd" }} />
                            <span className="fw-bold">{dept.Dept_Id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                            {dept.Department_Name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                            <Users size={16} className="me-2" style={{ color: "#3fe2cd" }} />
                            <span className="fw-bold">{dept.Department_Head || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                          <div className="d-flex align-items-center">
                            <Users size={16} className="me-2" style={{ color: "#3fe2cd" }} />
                            <span className="fw-bold">{dept.Total_Employee || 0}</span>
                          </div>
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
                              onClick={() => openViewModal(dept)}
                              disabled={loading}
                              title="View Department"
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
                              onClick={() => openEditModal(dept)}
                              disabled={loading}
                              title="Edit Department"
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
                              onClick={() => handleDelete(dept.id, dept.Department_Name)}
                              disabled={loading}
                              title="Delete Department"
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
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDepartments.length)} of {filteredDepartments.length} departments
            </small>
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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

      {/* Add/Edit Modal - NON-TRANSPARENT */}
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
                  <Building2 size={20} className="me-2" />
                  {editingDepartment ? 'Edit Department' : 'Add New Department'}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-3">
                    <AlertCircle size={16} className="me-2" />
                    {error}
                  </div>
                )}
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <IdCard size={16} className="me-1" />
                        Department ID *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Dept_Id"
                        value={formData.Dept_Id}
                        onChange={handleChange}
                        placeholder="Enter Department ID (e.g., DEPT001)"
                        required
                        disabled={loading}
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
                        Department Name *
                      </label>
                      <select
                        className="form-control"
                        name="Department_Name"
                        value={formData.Department_Name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        <option value="">Select Department Name</option>
                        {getAvailableDepartmentNames().map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      {getAvailableDepartmentNames().length === 0 && (
                        <div className="form-text text-warning">
                          All department names have been used. Please edit existing departments if needed.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Department Head
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Department_Head"
                        value={formData.Department_Head}
                        onChange={handleChange}
                        placeholder="Enter Department Head Name"
                        disabled={loading}
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
                        Total Employees
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="Department_Total_Employee"
                        value={formData.Department_Total_Employee}
                        onChange={handleChange}
                        placeholder="Enter Total Number of Employees"
                        min="0"
                        disabled={loading}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                      <div className="form-text" style={{ color: "#6c757d" }}>
                        This field will be automatically updated based on employee assignments
                      </div>
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
                  disabled={loading}
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
                  disabled={loading}
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      {editingDepartment ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      {editingDepartment ? 'Update Department' : 'Save Department'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal - NON-TRANSPARENT */}
      {showViewModal && viewingDepartment && (
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
                  <Building2 size={20} className="me-2" />
                  Department Details
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
                      borderRadius: "50%",
                      color: "white"
                    }}
                  >
                    <Building2 size={40} />
                  </div>
                  <h4 className="mt-3" style={{ color: "#2c5f5d" }}>
                    {viewingDepartment.Department_Name}
                  </h4>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <IdCard size={16} className="me-1" />
                        Department ID
                      </label>
                      <div 
                        className="p-3"
                        style={{ 
                          color: "#5a6c6b", 
                          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef"
                        }}
                      >
                        <span className="fw-bold">{viewingDepartment.Dept_Id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Building2 size={16} className="me-1" />
                        Department Name
                      </label>
                      <div 
                        className="p-3"
                        style={{ 
                          color: "#5a6c6b", 
                          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef"
                        }}
                      >
                        <span className="fw-bold">{viewingDepartment.Department_Name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Department Head
                      </label>
                      <div 
                        className="p-3"
                        style={{ 
                          color: "#5a6c6b", 
                          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef"
                        }}
                      >
                        <span className="fw-bold">{viewingDepartment.Department_Head || 'Not Assigned'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Total Employees
                      </label>
                      <div 
                        className="p-3"
                        style={{ 
                          color: "#5a6c6b", 
                          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef"
                        }}
                      >
                        <span className="fw-bold fs-5" style={{ color: "#3fe2cd" }}>
                          {viewingDepartment.Department_Total_Employee || '0'}
                        </span>
                        <span className="ms-1">Employees</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Hash size={16} className="me-1" />
                        Employee Range
                      </label>
                      <div className="p-3" style={{ borderRadius: "8px", border: "1px solid #e9ecef" }}>
                        <span 
                          className="badge"
                          style={{
                            background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                            color: "white",
                            borderRadius: "20px",
                            padding: "8px 16px",
                            fontSize: "0.9rem"
                          }}
                        >
                          {getEmployeeRangeFilter(viewingDepartment.Department_Total_Employee) || 'Not Set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Statistics */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div 
                      className="card"
                      style={{
                        background: "linear-gradient(135deg, #3fe2cd15, #ffffff90)",
                        border: "1px solid rgba(63, 226, 205, 0.2)",
                        borderRadius: "12px"
                      }}
                    >
                      <div className="card-body text-center py-4">
                        <h6 className="mb-3" style={{ color: "#2c5f5d" }}>Department Status</h6>
                        <div className="d-flex justify-content-center align-items-center">
                          <div 
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Building2 size={20} style={{ color: "white" }} />
                          </div>
                          <div>
                            <div className="fw-bold" style={{ color: "#2c5f5d", fontSize: "1.2rem" }}>
                              {viewingDepartment.Department_Total_Employee > 0 ? 'Active Department' : 'New Department'}
                            </div>
                            <small className="text-muted">
                              {viewingDepartment.Department_Total_Employee > 0 
                                ? 'Has assigned employees' 
                                : 'No employees assigned yet'
                              }
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="row mt-3">
                  <div className="col-12">
                    <div 
                      className="alert alert-info"
                      style={{
                        background: "linear-gradient(45deg, #d1ecf1, #bee5eb)",
                        border: "1px solid #17a2b8",
                        borderRadius: "8px"
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <Building2 size={16} className="me-2" />
                        <small>
                          <strong>Department ID:</strong> {viewingDepartment.Dept_Id} | 
                          <strong className="ms-2">Created:</strong> {new Date().toLocaleDateString()} |
                          <strong className="ms-2">Type:</strong> {getEmployeeRangeFilter(viewingDepartment.Department_Total_Employee) || 'Startup'}
                        </small>
                      </div>
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
                  className="btn me-2"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(viewingDepartment);
                  }}
                  style={{
                    background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  <Edit3 size={16} className="me-1" />
                  Edit Department
                </button>
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

export default DepartmentTable;