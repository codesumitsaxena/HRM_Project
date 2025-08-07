import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_id: '',
    phone: '',
    join_date: '',
    role: '',
    email: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

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
      email: ''
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const formattedDate = formData.join_date?.split('T')[0];
      const updatedFormData = { ...formData, join_date: formattedDate };
  
      if (editingEmployee) {
        await axios.put(`http://localhost:3000/api/employees/${editingEmployee.id}`, updatedFormData);
      } else {
        await axios.post('http://localhost:3000/api/employees', updatedFormData);
      }
  
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };
  
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await axios.delete(`http://localhost:3000/api/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <Row className="align-items-center mb-3">
        <Col md={4}><h4>Employee Table</h4></Col>
        <Col md={4}>
          <Form.Control
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-end">
          <Button onClick={openAddModal}>+ Add Employee</Button>
        </Col>
      </Row>

      <Table bordered hover responsive size="sm" className="small text-center">
        <thead className="table-light">
          <tr>
            <th>NO.</th>
            <th>Full Name</th>
            <th>Employee ID</th>
            <th>Phone</th>
            <th>Join Date</th>
            <th>Role</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>
              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.employee_id}</td>
              <td>{emp.phone}</td>
              <td>{new Date(emp.join_date).toISOString().split("T")[0]}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => openEditModal(emp)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(emp.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" value={formData.first_name} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" value={formData.last_name} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control name="employee_id" value={formData.employee_id} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Join Date</Form.Label>
                <Form.Control type="date" name="join_date" value={formData.join_date} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control name="role" value={formData.role} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editingEmployee ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeTable;
