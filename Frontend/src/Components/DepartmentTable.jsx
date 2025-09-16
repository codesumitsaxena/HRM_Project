// DepartmentTable.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import api from "../api";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ Department_Name: "", Department_Head: "", Total_Employee: 0 });
  const [loading, setLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Backend pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    limit: 10
  });

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState('');

  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // 🛠️ NEW STATE: Store the dynamic list of available departments for the dropdown
  const [availableDepartments, setAvailableDepartments] = useState([]);

  // Department options for dropdown
  const allDepartmentOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "HR" },
    { value: "Marketing", label: "Marketing" },
    { value: "Quality Assurance", label: "Quality Assurance" },
    { value: "Cyber Security", label: "Cyber Security" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(query);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Main useEffect to fetch data and update available departments
  useEffect(() => {
    fetchDepartments(currentPage, searchDebounce);
  }, [currentPage, searchDebounce]);

  const fetchDepartments = async (page = 1, searchTerm = '') => {
    setIsTableLoading(true);
    try {
      const params = {
        page: page,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };
      
      const res = await api.get("/departments", { params });
      setDepartments(res.data.data);
      setPagination(res.data.pagination);

      // 🛠️ NEW LOGIC: Update the list of available departments
      const fetchedDeptNames = res.data.data.map(d => d.Department_Name);
      setAvailableDepartments(
        allDepartmentOptions.filter(option => !fetchedDeptNames.includes(option.value))
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setDepartments([]);
      setPagination({
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        limit: 10
      });
      setAvailableDepartments(allDepartmentOptions); // Reset dropdown on error
      if (err.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection.");
      } else {
        alert("Failed to load departments");
      }
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  };

  // ✅ Open Add form
  function openAdd() {
    setEditing(null);
    setForm({ Department_Name: "", Department_Head: "", Total_Employee: 0 });
    setValidationErrors({});
    setShowModal(true);
  }

  // ✅ Open Edit form
  function openEdit(dept) {
    setEditing(dept);
    setForm({
      Department_Name: dept.Department_Name,
      Department_Head: dept.Department_Head,
      Total_Employee: dept.Total_Employee || 0,
    });
    setValidationErrors({});

    // 🛠️ NEW LOGIC: For editing, add the current department's name back to the list
    const filteredOptions = allDepartmentOptions.filter(
      option => !departments.map(d => d.Department_Name).includes(option.value) || option.value === dept.Department_Name
    );
    setAvailableDepartments(filteredOptions);
    
    setShowModal(true);
  }

  // ✅ Delete department using api
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await api.delete(`/departments/${id}`);
      if (departments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchDepartments(currentPage, searchDebounce);
      }
    } catch (err) {
      console.error("Delete error:", err);
      if (err.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection.");
      } else {
        alert("Failed to delete department");
      }
    }
  }

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!form.Department_Name.trim()) {
      errors.Department_Name = "Department name is required";
    }

    if (!form.Department_Head.trim()) {
      errors.Department_Head = "Department head is required";
    }

    if (form.Total_Employee < 0) {
      errors.Total_Employee = "Total employees cannot be negative";
    }

    return errors;
  };

  // ✅ Add / Update department using api
  const handleSave = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaveLoading(true);

    try {
      if (editing) {
        await api.put(`/departments/${editing.Dept_Id}`, form);
      } else {
        await api.post(`/departments`, form);
      }
      
      closeModal();
      fetchDepartments(currentPage, searchDebounce);
    } catch (err) {
      console.error("Save error:", err);
      if (err.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection.");
      } else {
        alert("Failed to save department");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // ✅ handleChange with validation error clearing
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  const closeModal = () => {
    if (!saveLoading) {
      setShowModal(false);
      setValidationErrors({});
      setSaveLoading(false);
      setForm({ Department_Name: "", Department_Head: "", Total_Employee: 0 });
      setEditing(null);
    }
  };

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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 rightArea">
      <Row className="align-items-center mb-3">
        <Col md={4}><h4>Departments</h4></Col>
        <Col md={4} sm={12} className="mb-2">
          <InputGroup>
            <FormControl
              placeholder="Search departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setQuery("")}>Clear</Button>
          </InputGroup>
        </Col>
        <Col md={4} sm={12} className="text-end">
          <Button onClick={openAdd}>+ Add New</Button>
        </Col>
      </Row>

      <Table bordered hover responsive className="Medium text-center mb-0">
        <thead className="table-secondary">
          <tr>
            <th>No</th>
            <th>Dept_Id</th>
            <th>Department_Name</th>
            <th>Department_Head</th>
            <th>Total_Employee</th>
            <th style={{ width: "100px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isTableLoading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          ) : departments.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {searchDebounce ? 'No departments found matching your search' : 'No departments found'}
              </td>
            </tr>
          ) : (
            departments.map((d, idx) => (
              <tr key={d.Dept_Id}>
                <td>{(currentPage - 1) * 10 + idx + 1}</td>
                <td>{d.Dept_Id}</td>
                <td>{d.Department_Name}</td>
                <td>{d.Department_Head || "-"}</td>
                <td>{d.Total_Employee || 0}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button size="sm" variant="primary" onClick={() => openEdit(d)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(d.Dept_Id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Backend Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing {departments.length} of {pagination.totalItems} result(s)
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

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={closeModal} backdrop={saveLoading ? "static" : true}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton={!saveLoading}>
            <Modal.Title>{editing ? "Edit Department" : "Add Department"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="deptName">
              <Form.Label>
                Department Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select 
                name="Department_Name" 
                value={form.Department_Name} 
                onChange={handleChange}
                isInvalid={!!validationErrors.Department_Name}
                disabled={saveLoading || (editing && true)} // 🛠️ Disabled on edit mode to prevent changing department name
              >
                {/* 🛠️ UPDATED: Use the new availableDepartments state */}
                <option value="">Select a department</option>
                {editing ? (
                  // For editing, show only the current name + other available
                  availableDepartments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))
                ) : (
                  // For adding, show only available departments
                  availableDepartments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))
                )}
              </Form.Select>
              {validationErrors.Department_Name && (
                <div className="text-danger small mt-1">
                  {validationErrors.Department_Name}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="deptHead">
              <Form.Label>
                Department Head <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control 
                name="Department_Head" 
                value={form.Department_Head} 
                onChange={handleChange}
                placeholder="Enter department head name"
                isInvalid={!!validationErrors.Department_Head}
                disabled={saveLoading}
              />
              {validationErrors.Department_Head && (
                <div className="text-danger small mt-1">
                  {validationErrors.Department_Head}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="deptTotal">
              <Form.Label>
                Total Employees
              </Form.Label>
              <Form.Control 
                type="number" 
                name="Total_Employee" 
                value={form.Total_Employee} 
                onChange={handleChange}
                placeholder="Enter total employees"
                min="0"
                isInvalid={!!validationErrors.Total_Employee}
                disabled={saveLoading}
              />
              {validationErrors.Total_Employee && (
                <div className="text-danger small mt-1">
                  {validationErrors.Total_Employee}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={saveLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saveLoading}>
              {saveLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {editing ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                editing ? 'Update' : 'Save'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}