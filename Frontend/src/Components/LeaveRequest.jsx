// LeaveRequest.jsx - Updated with CSS for fixed width
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Spinner,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import api from "../api"; // ✅ Use centralized API
import './LeaveRequest.css'; // ✅ Add this line

export default function LeaveRequest() {
  const [leaveData, setLeaveData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null); // Consistent naming
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Used for modal save button
  const [isTableLoading, setIsTableLoading] = useState(false); // Used for table data loading
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Employee_Id: "",
    Leave_Type: "Casual Leave",
    Start_Date: "",
    End_Date: "",
    Reason: "",
  });

  // Backend pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    limit: 10,
  });

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchLeaves(currentPage, searchDebounce);
  }, [currentPage, searchDebounce]);

  const fetchLeaves = async (page = 1, searchTerm = "") => {
    setIsTableLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
      };

      const res = await api.get("/Leave_Request", { params });
      setLeaveData(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching leave requests:", error);

      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to load leave requests");
      } else {
        alert("Something went wrong while loading leave requests. Please try again.");
      }

      setLeaveData([]);
      setPagination({
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false,
        limit: 10,
      });
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingLeave(null);
    setValidated(false);
    setFormData({
      First_Name: "",
      Last_Name: "",
      Employee_Id: "",
      Leave_Type: "Casual Leave",
      Start_Date: "",
      End_Date: "",
      Reason: "",
    });
    setShowModal(true);
  };

  const openEditModal = (req) => {
    setEditingLeave(req);
    setValidated(false);
    const formattedStartDate = req.Start_Date ? new Date(req.Start_Date).toISOString().split("T")[0] : "";
    const formattedEndDate = req.End_Date ? new Date(req.End_Date).toISOString().split("T")[0] : "";
    setFormData({
      ...req,
      Start_Date: formattedStartDate,
      End_Date: formattedEndDate,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setValidated(false);
    setEditingLeave(null);
    setIsLoading(false);
    setFormData({
      First_Name: "",
      Last_Name: "",
      Employee_Id: "",
      Leave_Type: "Casual Leave",
      Start_Date: "",
      End_Date: "",
      Reason: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    if (formData.End_Date && formData.Start_Date && new Date(formData.End_Date) < new Date(formData.Start_Date)) {
      alert("End date cannot be earlier than start date.");
      setValidated(true);
      return;
    }

    setIsLoading(true);

    const payload = { ...formData };
    if (payload.Start_Date) {
      payload.Start_Date = new Date(payload.Start_Date).toISOString().split("T")[0];
    }
    if (payload.End_Date) {
      payload.End_Date = new Date(payload.End_Date).toISOString().split("T")[0];
    }

    try {
      let response;
      if (editingLeave) {
        response = await api.put(`/Leave_Request/${editingLeave.Leave_Id}`, payload);
      } else {
        response = await api.post("/Leave_Request", payload);
      }

      alert(response.data.message || (editingLeave ? "Leave request updated successfully!" : "Leave request added successfully!"));

      closeModal();
      fetchLeaves(currentPage, searchDebounce);
    } catch (error) {
      console.error("Save error:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const response = await api.delete(`/Leave_Request/${id}`);

        alert(response.data.message || "Leave request deleted successfully!");

        if (leaveData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchLeaves(currentPage, searchDebounce);
        }
      } catch (error) {
        console.error("Error deleting leave request:", error);
        if (error.response && error.response.data) {
          alert(error.response.data.message || "Failed to delete leave request");
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

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
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

  return (
    <Container className="mt-4 rightArea">
      <Row className="align-items-center mb-3">
        <Col md={4}>
          <h4>Leave Requests</h4>
        </Col>
        <Col md={4} sm={12} className="mb-2">
          <InputGroup>
            <FormControl
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearch("")}>
              Clear
            </Button>
          </InputGroup>
        </Col>
        <Col md={4} sm={12} className="text-end">
          <Button onClick={openAddModal}>+ Add New</Button>
        </Col>
      </Row>

      {/* Leave Request Table */}
      <div className="leave-table-container">
        <Table bordered hover responsive className="Medium text-center mb-0">
          <thead className="table-secondary">
            <tr>
              <th>No</th>
              <th>Leave_Id</th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : leaveData.length > 0 ? (
              leaveData.map((d, idx) => (
                <tr key={d.Leave_Id}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{d.Leave_Id}</td>
                  <td>{`${d.First_Name} ${d.Last_Name}`}</td>
                  <td>{d.Employee_Id}</td>
                  <td>{d.Leave_Type || "N/A"}</td>
                  <td>{new Date(d.Start_Date).toISOString().split("T")[0]}</td>
                  <td>{new Date(d.End_Date).toISOString().split("T")[0]}</td>
                  <td>{d.Reason}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openEditModal(d)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(d.Leave_Id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  {searchDebounce
                    ? "No leave requests found matching your search"
                    : "No leave requests found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing {leaveData.length} of {pagination.totalItems} result(s)
            {searchDebounce && ` for "${searchDebounce}"`}
          </div>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevious || isTableLoading}
            >
              Previous
            </Button>
            {getPageNumbers().map((num) => (
              <Button
                key={num}
                size="sm"
                variant={num === currentPage ? "primary" : "outline-primary"}
                onClick={() => handlePageClick(num)}
                disabled={isTableLoading}
              >
                {num}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline-primary"
              onClick={handleNextPage}
              disabled={!pagination.hasNext || isTableLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingLeave ? "Edit Leave Request" : "Add Leave Request"}
            </Modal.Title>
          </Modal.Header>
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
                    Employee ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="Employee_Id"
                    value={formData.Employee_Id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an employee ID.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Leave Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="Leave_Type"
                    value={formData.Leave_Type}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select a leave type</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a leave type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    From Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="Start_Date"
                    value={formData.Start_Date}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a start date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    To Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="End_Date"
                    value={formData.End_Date}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an end date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Reason <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                name="Reason"
                value={formData.Reason}
                onChange={handleChange}
                placeholder="Enter reason for leave"
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a reason.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {editingLeave ? "Updating..." : "Saving..."}
                </>
              ) : (
                editingLeave ? "Update" : "Save"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}