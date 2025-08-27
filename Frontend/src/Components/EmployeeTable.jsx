import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://122.161.76.148:3000/api/employee');
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
    // Format Join_Date to yyyy-MM-dd for date input
    const formattedDate = emp.Join_Date ? new Date(emp.Join_Date).toISOString().split('T')[0] : '';
    setFormData({ ...emp, Join_Date: formattedDate });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Prepare data to send (join date in YYYY-MM-DD)
      const payload = { ...formData };
      if (payload.Join_Date) {
        payload.Join_Date = payload.Join_Date.split('T')[0];
      }

      if (editingEmployee) {
        await axios.put(`http://122.161.76.148:3000/api/employee/${editingEmployee.Employee_Id}`, payload);
      } else {
        await axios.post('http://122.161.76.148:3000/api/employee', payload);
      }
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await axios.delete(`http://122.161.76.148:3000/api/employee/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    (`${emp.First_Name} ${emp.Last_Name}`).toLowerCase().includes(search.toLowerCase())
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
            <th>Address</th>
            <th>Join Date</th>
            <th>Designation</th>
            <th>Basic Salary</th>
            <th>Department ID</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={emp.Employee_Id}>
              <td>{index + 1}</td>
              <td>{emp.First_Name} {emp.Last_Name}</td>
              <td>{emp.Employee_Id}</td>
              <td>{emp.Phone}</td>
              <td>{emp.Address}</td>
              <td>{emp.Join_Date ? new Date(emp.Join_Date).toISOString().split("T")[0] : ''}</td>
              <td>{emp.Designation}</td>
              <td>{emp.Basic_Salary}</td>
              <td>{emp.Department_Id}</td>
              <td>{emp.Email}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => openEditModal(emp)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(emp.Employee_Id)}>Delete</Button>
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
                <Form.Control
                  name="First_Name"
                  value={formData.First_Name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="Last_Name"
                  value={formData.Last_Name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  name="Employee_Id"
                  value={formData.Employee_Id}
                  onChange={handleChange}
                  disabled={!!editingEmployee} // Disable editing ID when editing
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="Address"
              value={formData.Address}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Join Date</Form.Label>
                <Form.Control
                  type="date"
                  name="Join_Date"
                  value={formData.Join_Date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Basic Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="Basic_Salary"
                  value={formData.Basic_Salary}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department ID</Form.Label>
                <Form.Control
                  type="number"
                  name="Department_Id"
                  value={formData.Department_Id}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
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
