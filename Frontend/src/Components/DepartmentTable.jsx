import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

// DepartmentTable - single-file React component using react-bootstrap
// Features: list departments (mock data), search, add, edit, delete, simple pagination

export default function DepartmentTable({ initialData = null, pageSize = 5 }) {
  const sample = [
    { id: 1, name: "Human Resources", code: "HR", manager: "Anita Sharma" },
    { id: 2, name: "Engineering", code: "ENG", manager: "Rajat Verma" },
    { id: 3, name: "Sales", code: "SAL", manager: "Priya Singh" },
    { id: 4, name: "Finance", code: "FIN", manager: "Karan Gupta" },
    { id: 5, name: "Marketing", code: "MKT", manager: "Neha Patel" },
    { id: 6, name: "Customer Success", code: "CS", manager: "Samir Rao" },
  ];

  const [departments, setDepartments] = useState(initialData ?? sample);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // department object when editing
  const [form, setForm] = useState({ name: "", code: "", manager: "" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // If parent passes updated initialData, update local state
    if (initialData) setDepartments(initialData);
  }, [initialData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        (d.manager && d.manager.toLowerCase().includes(q))
    );
  }, [departments, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", code: "", manager: "" });
    setShowModal(true);
  }

  function openEdit(dept) {
    setEditing(dept);
    setForm({ name: dept.name, code: dept.code, manager: dept.manager || "" });
    setShowModal(true);
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }

  function handleSave(e) {
    e.preventDefault();
    const name = form.name.trim();
    const code = form.code.trim();
    if (!name || !code) {
      alert("Please provide department name and code.");
      return;
    }

    if (editing) {
      // update
      setDepartments((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, name, code, manager: form.manager } : d))
      );
    } else {
      // add new
      const id = Math.max(0, ...departments.map((d) => d.id)) + 1;
      setDepartments((prev) => [...prev, { id, name, code, manager: form.manager }]);
      // jump to last page where new item appears
      const newCount = filtered.length + 1;
      const newTotal = Math.ceil(newCount / pageSize);
      setCurrentPage(newTotal);
    }

    setShowModal(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  return (
    <div className="p-3">
      <Row className="align-items-center mb-3">
        <Col md={4}><h4>Department Table</h4></Col>
        <Col md={4} sm={12} className="mb-2">
          <InputGroup>
            <FormControl
              placeholder="Search departments by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setQuery("")}>Clear</Button>
          </InputGroup>
        </Col>
        <Col md={4} sm={12} className="text-end">
          <Button onClick={openAdd}>+ Add Department</Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Dept_Id</th>
            <th>Department_Name</th>
            <th>Department_Head</th>
            <th style={{ width: 150 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No departments found.
              </td>
            </tr>
          ) : (
            pageData.map((d, idx) => (
              <tr key={d.id}>
                <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                <td>{d.name}</td>
                <td>{d.code}</td>
                
                <td>{d.manager || "-"}</td>
                <td>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => openEdit(d)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(d.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <div>Showing {filtered.length} result(s)</div>
        <Pagination className="mb-0">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} />

          {Array.from({ length: totalPages }).map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Department" : "Add Department"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2" controlId="deptName">
              <Form.Label>Department Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="deptCode">
              <Form.Label>Code</Form.Label>
              <Form.Control name="code" value={form.code} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="deptManager">
              <Form.Label>Manager</Form.Label>
              <Form.Control name="manager" value={form.manager} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
