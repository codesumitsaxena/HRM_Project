import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Plus, Search, Edit3, Trash2, Eye, 
  Filter, Download, Upload, CheckCircle, 
  XCircle, User, CalendarDays, AlertCircle,
  Building2, Users, Camera, Image, Play, Square
} from 'lucide-react';

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    fetchAttendanceRecords();
    fetchEmployees();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const fetchAttendanceRecords = async () => {
    try {
      // Simulated API call - replace with your actual endpoint
      const mockData = [
        {
          Attendance_Id: 1,
          Employee_Id: 101,
          Date: '2024-01-15',
          Check_In_Time: '09:00:00',
          Check_Out_Time: '18:00:00',
          Status: 'Present',
          Image_URL: 'https://via.placeholder.com/100x100?text=Photo1'
        },
        {
          Attendance_Id: 2,
          Employee_Id: 102,
          Date: '2024-01-15',
          Check_In_Time: '09:15:00',
          Check_Out_Time: null,
          Status: 'Present',
          Image_URL: 'https://via.placeholder.com/100x100?text=Photo2'
        }
      ];
      setAttendanceRecords(mockData);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setAttendanceRecords([]);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      // Simulated employee data - replace with your actual endpoint
      const mockEmployees = [
        { Employee_Id: 101, First_Name: 'John', Last_Name: 'Doe' },
        { Employee_Id: 102, First_Name: 'Jane', Last_Name: 'Smith' },
        { Employee_Id: 103, First_Name: 'Mike', Last_Name: 'Johnson' }
      ];
      setEmployees(mockEmployees);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [capturedImage, setCapturedImage] = useState(null);

  const [formData, setFormData] = useState({
    Attendance_Id: '',
    Employee_Id: '',
    Date: '',
    Check_In_Time: '',
    Check_Out_Time: '',
    Status: 'Present',
    Image_URL: ''
  });

  const statusOptions = ['Present', 'Absent', 'Late', 'Half Day'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'linear-gradient(45deg, #28a745, #20c997)';
      case 'Absent':
        return 'linear-gradient(45deg, #dc3545, #c82333)';
      case 'Late':
        return 'linear-gradient(45deg, #ffc107, #fd7e14)';
      case 'Half Day':
        return 'linear-gradient(45deg, #17a2b8, #20c997)';
      default:
        return 'linear-gradient(45deg, #6c757d, #495057)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={14} />;
      case 'Absent':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCapturing(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingRecord(null);
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    setFormData({
      Attendance_Id: '',
      Employee_Id: '',
      Date: currentDate,
      Check_In_Time: currentTime,
      Check_Out_Time: '',
      Status: 'Present',
      Image_URL: ''
    });
    setCapturedImage(null);
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({ 
      ...record,
      Date: record.Date ? record.Date.split('T')[0] : '',
      Check_In_Time: record.Check_In_Time || '',
      Check_Out_Time: record.Check_Out_Time || ''
    });
    setCapturedImage(record.Image_URL);
    setShowModal(true);
  };

  const openViewModal = (record) => {
    setViewingRecord(record);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedData = {
        ...formData,
        Employee_Id: formData.Employee_Id ? parseInt(formData.Employee_Id) : null,
        Image_URL: capturedImage || formData.Image_URL
      };

      if (!formattedData.Employee_Id) {
        alert("Please select an employee");
        setSaving(false);
        return;
      }

      if (!formattedData.Date) {
        alert("Please select a date");
        setSaving(false);
        return;
      }

      // Here you would make your API call
      console.log("Saving attendance data:", formattedData);
      
      // Simulate API success
      setTimeout(() => {
        alert(editingRecord ? "Attendance updated successfully!" : "Attendance added successfully!");
        fetchAttendanceRecords();
        setShowModal(false);
        setCapturedImage(null);
        setSaving(false);
      }, 1000);

    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      // Here you would make your API call
      console.log("Deleting attendance:", attendanceId);
      alert("Attendance record deleted successfully!");
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      alert("Error deleting attendance record. Please try again.");
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.Employee_Id == employeeId);
    return employee ? `${employee.First_Name} ${employee.Last_Name}` : `Employee ${employeeId}`;
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    const diffMinutes = outMinutes - inMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const employeeName = getEmployeeName(record.Employee_Id);
    const searchText = `${employeeName} ${record.Attendance_Id || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus = filterStatus === '' || record.Status === filterStatus;
    const matchesEmployee = filterEmployee === '' || record.Employee_Id == filterEmployee;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div 
      className="p-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
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
                <Clock size={24} className="me-2" style={{ color: "#2c5f5d" }} />
                <h4 className="mb-0" style={{ color: "#2c5f5d" }}>Attendance Management</h4>
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
              >
                <Plus size={16} className="me-1" />
                Mark Attendance
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
            <div className="col-md-4 mb-3">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: "#2c5f5d" }} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search attendance records..."
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
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                  border: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "8px"
                }}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.Employee_Id} value={emp.Employee_Id}>
                    {emp.First_Name} {emp.Last_Name} ({emp.Employee_Id})
                  </option>
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
                  setFilterStatus('');
                  setFilterEmployee('');
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
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
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>ID</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Employee</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Date</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Check In</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Check Out</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Hours</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Status</th>
                    <th className="border-0 px-4 py-3" style={{ color: "#2c5f5d" }}>Photo</th>
                    <th className="border-0 px-4 py-3 text-center" style={{ color: "#2c5f5d" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.Attendance_Id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>{record.Attendance_Id}</td>
                      <td className="px-4 py-3">
                        <div className="fw-bold" style={{ color: "#2c5f5d" }}>
                          {getEmployeeName(record.Employee_Id)}
                        </div>
                        <small style={{ color: "#5a6c6b" }}>ID: {record.Employee_Id}</small>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>
                        {new Date(record.Date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>
                        {record.Check_In_Time || 'Not checked in'}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#5a6c6b" }}>
                        {record.Check_Out_Time || 'Not checked out'}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#2c5f5d" }}>
                        {calculateWorkingHours(record.Check_In_Time, record.Check_Out_Time)}
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            background: getStatusColor(record.Status),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem"
                          }}
                        >
                          {getStatusIcon(record.Status)} {record.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {record.Image_URL && (
                          <img 
                            src={record.Image_URL} 
                            alt="Attendance"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              border: "2px solid #3fe2cd"
                            }}
                          />
                        )}
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
                            onClick={() => openViewModal(record)}
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
                            onClick={() => openEditModal(record)}
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
                            onClick={() => handleDelete(record.Attendance_Id)}
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

      {/* Mobile Cards */}
      <div className="d-md-none">
        {currentRecords.map((record) => (
          <div 
            key={record.Attendance_Id}
            className="card mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              border: "1px solid rgba(63, 226, 205, 0.2)",
              borderRadius: "12px"
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  {record.Image_URL && (
                    <img 
                      src={record.Image_URL} 
                      alt="Attendance"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #3fe2cd"
                      }}
                      className="me-3"
                    />
                  )}
                  <div>
                    <h6 className="mb-0" style={{ color: "#2c5f5d" }}>
                      {getEmployeeName(record.Employee_Id)}
                    </h6>
                    <small style={{ color: "#5a6c6b" }}>ID: {record.Employee_Id}</small>
                  </div>
                </div>
                <span 
                  className="badge"
                  style={{ 
                    background: getStatusColor(record.Status),
                    color: "white",
                    borderRadius: "20px"
                  }}
                >
                  {getStatusIcon(record.Status)} {record.Status}
                </span>
              </div>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <CalendarDays size={14} className="me-1" />
                {new Date(record.Date).toLocaleDateString()}
              </p>
              <p className="small mb-1" style={{ color: "#5a6c6b" }}>
                <Clock size={14} className="me-1" />
                In: {record.Check_In_Time || 'N/A'} | Out: {record.Check_Out_Time || 'N/A'}
              </p>
              <p className="small mb-3" style={{ color: "#5a6c6b" }}>
                <Clock size={14} className="me-1" />
                Hours: {calculateWorkingHours(record.Check_In_Time, record.Check_Out_Time)}
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
                  onClick={() => openViewModal(record)}
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
                  onClick={() => openEditModal(record)}
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  className="btn btn-sm flex-fill"
                  style={{
                    background: "linear-gradient(45deg, #dc3545, #c82333)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px"
                  }}
                  onClick={() => handleDelete(record.Attendance_Id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{
                    background: currentPage === 1 ? "#f8f9fa" : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: currentPage === 1 ? "#6c757d" : "white",
                    border: "1px solid rgba(63, 226, 205, 0.3)"
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
                  style={{
                    background: currentPage === totalPages ? "#f8f9fa" : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: currentPage === totalPages ? "#6c757d" : "white",
                    border: "1px solid rgba(63, 226, 205, 0.3)"
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Add/Edit Modal */}
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
                  {editingRecord ? 'Edit Attendance' : 'Mark Attendance'}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowModal(false);
                    stopCamera();
                    setCapturedImage(null);
                  }}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Employee *
                      </label>
                      <select
                        className="form-select"
                        name="Employee_Id"
                        value={formData.Employee_Id}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.Employee_Id} value={emp.Employee_Id}>
                            {emp.First_Name} {emp.Last_Name} ({emp.Employee_Id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="Date"
                        value={formData.Date}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Check In Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="Check_In_Time"
                        value={formData.Check_In_Time}
                        onChange={handleChange}
                        disabled={saving}
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
                        <Clock size={16} className="me-1" />
                        Check Out Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="Check_Out_Time"
                        value={formData.Check_Out_Time}
                        onChange={handleChange}
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CheckCircle size={16} className="me-1" />
                        Status *
                      </label>
                      <select
                        className="form-select"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px"
                        }}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Working Hours
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={calculateWorkingHours(formData.Check_In_Time, formData.Check_Out_Time)}
                        disabled
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          background: "#f8f9fa"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Capture Section */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Camera size={16} className="me-1" />
                        Employee Photo (Required for attendance verification)
                      </label>
                      
                      {/* Camera Controls */}
                      <div className="d-flex gap-2 mb-3">
                        <button 
                          type="button"
                          className="btn"
                          style={{
                            background: capturing ? "linear-gradient(45deg, #dc3545, #c82333)" : "linear-gradient(45deg, #28a745, #20c997)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px"
                          }}
                          onClick={capturing ? stopCamera : startCamera}
                          disabled={saving}
                        >
                          {capturing ? (
                            <>
                              <Square size={16} className="me-1" />
                              Stop Camera
                            </>
                          ) : (
                            <>
                              <Play size={16} className="me-1" />
                              Start Camera
                            </>
                          )}
                        </button>
                        
                        {capturing && (
                          <button 
                            type="button"
                            className="btn"
                            style={{
                              background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                              color: "white",
                              border: "none",
                              borderRadius: "8px"
                            }}
                            onClick={captureImage}
                            disabled={saving}
                          >
                            <Camera size={16} className="me-1" />
                            Capture Photo
                          </button>
                        )}
                        
                        <label 
                          className="btn"
                          style={{
                            background: "linear-gradient(45deg, #17a2b8, #20c997)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                          }}
                        >
                          <Upload size={16} className="me-1" />
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={saving}
                          />
                        </label>
                      </div>

                      {/* Camera Preview */}
                      {capturing && (
                        <div 
                          className="mb-3 p-3 text-center"
                          style={{
                            border: "2px solid #3fe2cd",
                            borderRadius: "12px",
                            background: "#f8f9fa"
                          }}
                        >
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                              width: "100%",
                              maxWidth: "400px",
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #dee2e6"
                            }}
                          />
                        </div>
                      )}

                      {/* Captured Image Preview */}
                      {capturedImage && (
                        <div 
                          className="mb-3 p-3 text-center"
                          style={{
                            border: "2px solid #3fe2cd",
                            borderRadius: "12px",
                            background: "#f8f9fa"
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold" style={{ color: "#2c5f5d" }}>
                              <Image size={16} className="me-1" />
                              Captured Photo
                            </span>
                            <button 
                              type="button"
                              className="btn btn-sm"
                              style={{
                                background: "linear-gradient(45deg, #dc3545, #c82333)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px"
                              }}
                              onClick={() => setCapturedImage(null)}
                              disabled={saving}
                            >
                              <XCircle size={14} className="me-1" />
                              Remove
                            </button>
                          </div>
                          <img
                            src={capturedImage}
                            alt="Captured"
                            style={{
                              width: "100%",
                              maxWidth: "300px",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #dee2e6"
                            }}
                          />
                        </div>
                      )}

                      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
                  onClick={() => {
                    setShowModal(false);
                    stopCamera();
                    setCapturedImage(null);
                  }}
                  disabled={saving}
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
                  disabled={saving || !capturedImage}
                  style={{
                    background: (!capturedImage || saving) 
                      ? "linear-gradient(45deg, #6c757d, #495057)"
                      : "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px"
                  }}
                >
                  {saving ? 'Saving...' : (editingRecord ? 'Update Attendance' : 'Mark Attendance')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingRecord && (
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
                  Attendance Details
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4" style={{ background: "#ffffff" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <AlertCircle size={16} className="me-1" />
                        Attendance ID
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRecord.Attendance_Id}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Users size={16} className="me-1" />
                        Employee
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {getEmployeeName(viewingRecord.Employee_Id)} ({viewingRecord.Employee_Id})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <CalendarDays size={16} className="me-1" />
                        Date
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {new Date(viewingRecord.Date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Status
                      </label>
                      <div className="p-2" style={{ 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        <span 
                          className="badge px-3 py-2"
                          style={{ 
                            background: getStatusColor(viewingRecord.Status),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.875rem"
                          }}
                        >
                          {getStatusIcon(viewingRecord.Status)} {viewingRecord.Status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Check In Time
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRecord.Check_In_Time || 'Not checked in'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Check Out Time
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {viewingRecord.Check_Out_Time || 'Not checked out'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                        <Clock size={16} className="me-1" />
                        Working Hours
                      </label>
                      <p className="mb-0 p-2" style={{ 
                        color: "#5a6c6b", 
                        background: "#f8f9fa",
                        borderRadius: "6px",
                        border: "1px solid #e9ecef"
                      }}>
                        {calculateWorkingHours(viewingRecord.Check_In_Time, viewingRecord.Check_Out_Time)}
                      </p>
                    </div>
                  </div>
                </div>
                {viewingRecord.Image_URL && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label fw-bold" style={{ color: "#2c5f5d" }}>
                          <Image size={16} className="me-1" />
                          Employee Photo
                        </label>
                        <div 
                          className="text-center p-3"
                          style={{ 
                            background: "#f8f9fa",
                            borderRadius: "6px",
                            border: "1px solid #e9ecef"
                          }}
                        >
                          <img 
                            src={viewingRecord.Image_URL} 
                            alt="Employee attendance"
                            style={{
                              maxWidth: "300px",
                              maxHeight: "300px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #3fe2cd"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

export default AttendanceTable;