import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Row,
  Col,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/employees");
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = (id) => {
    const emp = employees.find((e) => e._id === id);
    setSelectedEmployee(emp);
    setModalShow(true);
  };

  const handleDelete = (id) => {
    alert(`Delete employee with ID: ${id}`);
  };

  const handleAddNew = () => {
    alert("Redirect to Add New Employee form.");
  };

  const handleModalChange = (e) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleModalSave = () => {
    const updatedList = employees.map((emp) =>
      emp._id === selectedEmployee._id ? selectedEmployee : emp
    );
    setEmployees(updatedList);
    setModalShow(false);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-4">
        <Col md={4}>
          <h3 className="m-0">Employee List</h3>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={handleAddNew}>
            + Add New
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive className="align-middle custom-table">
        <thead className="table-secondary">
          <tr>
            <th className="text-center">S No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Phone</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((emp, index) => (
            <tr key={emp._id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
              <td className="text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>{emp.phone}</td>
              <td className="text-center">
                <FaRegEdit
                  style={{ cursor: "pointer", marginRight: "12px", fontSize: "20px" }}
                  onClick={() => handleEdit(emp._id)}
                  title="Edit"
                />
                <MdDeleteForever
                  style={{ cursor: "pointer", fontSize: "22px" }}
                  onClick={() => handleDelete(emp._id)}
                  title="Delete"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredEmployees.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={selectedEmployee.name || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={selectedEmployee.email || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  name="department"
                  value={selectedEmployee.department || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name="designation"
                  value={selectedEmployee.designation || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={selectedEmployee.phone || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeTable;
