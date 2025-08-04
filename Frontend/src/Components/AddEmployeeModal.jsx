import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddEmployeeModal = ({ show, onHide, onAdd }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const handleChange = (e) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (
      newEmployee.name &&
      newEmployee.email &&
      newEmployee.department &&
      newEmployee.designation &&
      newEmployee.phone
    ) {
      onAdd(newEmployee); // parent component ko data bhejna
      setNewEmployee({
        name: "",
        email: "",
        department: "",
        designation: "",
        phone: "",
      });
      onHide();
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={newEmployee.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              name="department"
              value={newEmployee.department}
              onChange={handleChange}
              placeholder="Enter department"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              name="designation"
              value={newEmployee.designation}
              onChange={handleChange}
              placeholder="Enter designation"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={newEmployee.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Add Employee
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmployeeModal;
