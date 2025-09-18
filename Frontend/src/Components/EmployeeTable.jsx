// EmployeeTable.jsx - Updated with backend pagination and department names
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Container, InputGroup, FormControl } from 'react-bootstrap';
import api from "../api"; // ✅ use centralized api

// Map department IDs to their names for display purposes
const departmentMap = {
  1: 'Engineering',
  2: 'Finance',
  3: 'HR',
  4: 'Marketing',
  5: 'Quality Assurance',
  6: 'Cyber Security',
};

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false); // Loading for table data
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
    Department_Id: ''
  });

  // Backend pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    limit: 10
  });

  // Debounce search to avoid too many API calls
  const [searchDebounce, setSearchDebounce] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchEmployees(currentPage, searchDebounce);
  }, [currentPage, searchDebounce]);

  // ✅ ADD this function to refresh department counts after employee operations
  const refreshDepartmentCounts = () => {
    // Call the global function exposed by DepartmentTable
    if (window.refreshDepartments) {
      window.refreshDepartments();
    }
  };

  const fetchEmployees = async (page = 1, searchTerm = '') => {
    setIsTableLoading(true);
    try {
      const params = {
        page: page,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };
      
      const res = await api.get("/Employee", { params });
      setEmployees(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
      
      // Enhanced error handling for fetch
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to load employees');
      } else {
        alert("Something went wrong while loading employees. Please try again.");
      }
      
      setEmployees([]);
      setPagination({
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        limit: 10
      });
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setValidated(false);
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
      Department_Id: ''
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setValidated(false);
    const formattedDate = emp.Join_Date ? new Date(emp.Join_Date).toISOString().split('T')[0] : '';
    setFormData({ ...emp, Join_Date: formattedDate });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setValidated(false);
    setEditingEmployee(null);
    setIsLoading(false);
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
      Department_Id: ''
    });
  };

  // ✅ UPDATE your handleSave function (in Employee component)
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    setIsLoading(true);

    const payload = { ...formData };

    // Ensure Join_Date is in YYYY-MM-DD format
    if (payload.Join_Date) {
      payload.Join_Date = new Date(payload.Join_Date).toISOString().split("T")[0];
    }

    try {
      let response;
      if (editingEmployee) {
        response = await api.put(`/Employee/${editingEmployee.Employee_Id}`, payload);
      } else {
        response = await api.post("/Employee", { ...payload, Employee_Id: undefined });
      }
      
      // ✅ Show success message
      alert(response.data.message || (editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!'));
      
      closeModal();
      // Refresh current page data
      fetchEmployees(currentPage, searchDebounce);
      
      // ✅ NEW: Refresh department counts after employee save
      refreshDepartmentCounts();
      
    } catch (error) {
      console.error("Save error:", error);
      
      // ✅ Enhanced error handling for save operations
      if (error.response && error.response.data) {
        alert(error.response.data.message); // ✅ "Department does not exist..." or other specific error
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATE your handleDelete function (in Employee component)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await api.delete(`/Employee/${id}`);
        
        // ✅ Show success message for delete
        alert(response.data.message || 'Employee deleted successfully!');
        
        // After delete, check if we need to go to previous page
        if (employees.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchEmployees(currentPage, searchDebounce);
        }

        // ✅ NEW: Refresh department counts after employee deletion
        refreshDepartmentCounts();

      } catch (error) {
        console.error('Error deleting employee:', error);
        
        // ✅ Enhanced error handling for delete operations
        if (error.response && error.response.data) {
          alert(error.response.data.message || 'Failed to delete employee');
        } else {
          alert("Something went wrong while deleting. Please try again.");
        }
      }
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <Container className="mt-4 rightArea">
      <Row className="align-items-center mb-3">
        <Col md={4}><h4>All Employees</h4></Col>
        <Col md={4} sm={12} className="mb-2">
          <InputGroup>
            <FormControl
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
          </InputGroup>
        </Col>
        <Col md={4} sm={12} className="text-end">
          <Button onClick={() => openAddModal()}>+ Add New</Button>
        </Col>
      </Row>

      {/* Employee Table */}
      <div>
        <Table bordered hover responsive className="Medium text-center mb-0">
          <thead className="table-secondary">
            <tr>
              <th>NO.</th>
              <th>Full Name</th>
              <th>Employee ID</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Join Date</th>
              <th>Designation</th>
              <th>Basic Salary</th>
              <th>Department</th>
              <th>Email</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((emp, index) => (
                <tr key={emp.Employee_Id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{emp.First_Name} {emp.Last_Name}</td>
                  <td>{emp.Employee_Id}</td>
                  <td>{emp.Phone}</td>
                  <td>{emp.Address}</td>
                  <td>{emp.Join_Date ? new Date(emp.Join_Date).toISOString().split("T")[0] : ''}</td>
                  <td>{emp.Designation}</td>
                  <td>{emp.Basic_Salary}</td>
                  <td>{departmentMap[emp.Department_Id]}</td>
                  <td>{emp.Email}</td>
                  <td className='text-center'>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="primary" size="sm" onClick={() => openEditModal(emp)}>Edit</Button> 
                      <Button variant="danger" size="sm" onClick={() => handleDelete(emp.Employee_Id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-muted py-4">
                  {searchDebounce ? 'No employees found matching your search' : 'No employees found'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Backend Pagination */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {employees.length} of {pagination.totalItems} result(s)
              {searchDebounce && ` for "${searchDebounce}"`}
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrevious || isTableLoading}
              >
                Previous
              </Button>
              
              {getPageNumbers().map(pageNum => (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => handlePageClick(pageNum)}
                  disabled={isTableLoading}
                >
                  {pageNum}
                </Button>
              ))}
              
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleNextPage}
                disabled={!pagination.hasNext || isTableLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Employee */}
      <Modal show={showModal} onHide={closeModal} centered size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="First_Name"
                    value={formData.First_Name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a first name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="Last_Name"
                    value={formData.Last_Name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a last name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
<Col md={6}>
  <Form.Group className="mb-3">
    <Form.Label>
      Phone <span className="text-danger">*</span>
    </Form.Label>
    <Form.Control
      required
      type="text"
      name="Phone"
      value={formData.Phone}
      onChange={(e) => {
        // Allow only digits
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        handleChange(e);
      }}
      maxLength="10" // ✅ user cannot type more than 10
      placeholder="Enter phone number"
      disabled={isLoading}
      pattern="^[0-9]{10}$" // ✅ requires exactly 10 digits at submit time
    />
    <Form.Control.Feedback type="invalid">
      Phone number must be exactly 10 digits.
    </Form.Control.Feedback>
  </Form.Group>
</Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Address <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                placeholder="Enter address"
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an address.
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Join Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="Join_Date"
                    value={formData.Join_Date}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a join date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Designation <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="Designation"
                    value={formData.Designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a designation.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Basic Salary <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    min="0"
                    max="99000"
                    step="1"
                    name="Basic_Salary"
                    value={formData.Basic_Salary}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Only allow whole numbers (no decimals during input)
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    placeholder="Enter basic salary"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.Basic_Salary > 99000
                    ? "Salary should not be above 99000."
                    : "Please enter a valid salary amount."}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="Department_Id"
                    value={formData.Department_Id}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select a department</option>
                    <option value="1">Engineering</option>
                    <option value="2">Finance</option>
                    <option value="3">HR</option>
                    <option value="4">Marketing</option>
                    <option value="5">Quality Assurance</option>
                    <option value="6">Cyber Security</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a department.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {editingEmployee ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                editingEmployee ? 'Update' : 'Save'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default EmployeeTable;