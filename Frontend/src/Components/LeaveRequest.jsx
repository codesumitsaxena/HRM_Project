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
} from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const itemsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      const dummy = [
        {
          id: 1,
          name: "Marshall Nichols",
          employeeId: "LA-0215",
          leaveType: "Casual Leave",
          fromDate: "2024-07-24",
          toDate: "2024-07-26",
          reason: "Family Function",
        },
        {
          id: 2,
          name: "Maryam Amiri",
          employeeId: "LA-0216",
          leaveType: "Medical Leave",
          fromDate: "2024-07-20",
          toDate: "2024-07-22",
          reason: "Birthday Party",
        },
      ];
      setLeaveData(dummy);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredData = leaveData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (data = null) => {
    if (data) {
      const [firstName, lastName] = data.name.split(" ");
      setFormData({
        id: data.id,
        firstName,
        lastName,
        employeeId: data.employeeId,
        leaveType: data.leaveType,
        fromDate: data.fromDate,
        toDate: data.toDate,
        reason: data.reason,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        employeeId: "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(null);
  };

  const saveData = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const newEntry = {
      id: formData.id || Date.now(),
      name: fullName,
      employeeId: formData.employeeId,
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
    };

    if (formData.id) {
      setLeaveData((prev) =>
        prev.map((item) => (item.id === formData.id ? newEntry : item))
      );
    } else {
      setLeaveData((prev) => [...prev, newEntry]);
    }
    closeModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deleteData = (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setLeaveData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">
        <Col md={4}>
          <h3>Leave Requests</h3>
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button onClick={() => openModal()}>+ Add New</Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead className="table-secondary">
          <tr>
            <th>SNO.</th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, index) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.name}</td>
              <td>{item.employeeId}</td>
              <td>{item.leaveType}</td>
              <td>{item.fromDate}</td>
              <td>{item.toDate}</td>
              <td>{item.reason}</td>
              <td className="text-center">
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => alert(`Approved: ${item.name}`)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => alert(`Rejected: ${item.name}`)}
                >
                  Reject
                </Button>
               
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-3">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredData.length / itemsPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{formData?.id ? "Edit" : "Add"} Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData?.firstName || ""}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData?.lastName || ""}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Leave Type</Form.Label>
                <Form.Select
                  name="leaveType"
                  value={formData?.leaveType || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  name="employeeId"
                  value={formData?.employeeId || ""}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={formData?.fromDate || ""}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={formData?.toDate || ""}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason / Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData?.reason || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveData}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LeaveRequest;
