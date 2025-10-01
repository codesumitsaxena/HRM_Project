// AttendanceManagement.jsx - Fixed width and responsive modal
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Eye, Users, CheckCircle, XCircle, 
  Clock, TrendingUp, User, Mail, Phone, Building2,
  Briefcase, X
} from 'lucide-react';

const AttendanceManagement = () => {
  // Sample employee data with departments
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      department: 'IT',
      designation: 'Software Engineer',
      email: 'john.doe@company.com',
      phone: '+91 9876543210',
      photo: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      name: 'Tim Hank',
      department: 'HR',
      designation: 'HR Manager',
      email: 'tim.hank@company.com',
      phone: '+91 9876543211',
      photo: 'https://i.pravatar.cc/150?img=13'
    },
    {
      id: 3,
      name: 'Frank Camly',
      department: 'Marketing',
      designation: 'Marketing Executive',
      email: 'frank.camly@company.com',
      phone: '+91 9876543212',
      photo: 'https://i.pravatar.cc/150?img=33'
    },
    {
      id: 4,
      name: 'Gary Camara',
      department: 'Finance',
      designation: 'Accountant',
      email: 'gary.camara@company.com',
      phone: '+91 9876543213',
      photo: 'https://i.pravatar.cc/150?img=14'
    },
    {
      id: 5,
      name: 'Fidel Tonn',
      department: 'Operations',
      designation: 'Operations Manager',
      email: 'fidel.tonn@company.com',
      phone: '+91 9876543214',
      photo: 'https://i.pravatar.cc/150?img=15'
    },
    {
      id: 6,
      name: 'Maryam Amiri',
      department: 'IT',
      designation: 'Senior Developer',
      email: 'maryam.amiri@company.com',
      phone: '+91 9876543215',
      photo: 'https://i.pravatar.cc/150?img=45'
    },
    {
      id: 7,
      name: 'Hossein Shams',
      department: 'HR',
      designation: 'HR Executive',
      email: 'hossein.shams@company.com',
      phone: '+91 9876543216',
      photo: 'https://i.pravatar.cc/150?img=16'
    }
  ]);

  // Festival dates for the year
  const festivals = {
    '2023-01-26': 'Republic Day',
    '2023-03-08': 'Holi',
    '2023-08-15': 'Independence Day',
    '2023-10-02': 'Gandhi Jayanti',
    '2023-11-12': 'Diwali',
    '2023-12-25': 'Christmas',
    '2024-01-26': 'Republic Day',
    '2024-03-08': 'Maha Shivaratri',
    '2024-03-25': 'Holi',
    '2024-08-15': 'Independence Day',
    '2024-10-02': 'Gandhi Jayanti',
    '2024-10-31': 'Diwali',
    '2024-12-25': 'Christmas',
    '2025-01-26': 'Republic Day',
    '2025-03-14': 'Holi',
    '2025-08-15': 'Independence Day',
    '2025-10-02': 'Gandhi Jayanti',
    '2025-10-20': 'Diwali',
    '2025-12-25': 'Christmas'
  };

  const getFestival = (year, month, day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return festivals[dateKey] || null;
  };

  const generateAttendance = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const attendance = {};
    
    employees.forEach(emp => {
      attendance[emp.id] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const festival = getFestival(year, month, day);
        
        if (dayOfWeek === 0) {
          attendance[emp.id].push({ day, status: 'weekend', type: 'full', festival: null });
        } else if (festival) {
          attendance[emp.id].push({ day, status: 'festival', type: 'full', festival });
        } else {
          const rand = Math.random();
          if (rand > 0.95) {
            attendance[emp.id].push({ day, status: 'absent', type: 'full', festival: null });
          } else if (rand > 0.90) {
            attendance[emp.id].push({ day, status: 'present', type: 'half', festival: null });
          } else {
            attendance[emp.id].push({ day, status: 'present', type: 'full', festival: null });
          }
        }
      }
    });
    
    return attendance;
  };

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    setAttendance(generateAttendance(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2023, 2024, 2025];
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const calculateStats = (empId) => {
    const empAttendance = attendance[empId] || [];
    const present = empAttendance.filter(a => a.status === 'present' && a.type === 'full').length;
    const halfDay = empAttendance.filter(a => a.status === 'present' && a.type === 'half').length;
    const absent = empAttendance.filter(a => a.status === 'absent').length;
    const weekends = empAttendance.filter(a => a.status === 'weekend').length;
    const festivalDays = empAttendance.filter(a => a.status === 'festival').length;
    const workingDays = daysInMonth - weekends - festivalDays;
    const attendanceRatio = workingDays > 0 ? ((present + halfDay * 0.5) / workingDays * 100).toFixed(1) : 0;

    return { present, halfDay, absent, weekends, festivalDays, workingDays, attendanceRatio };
  };

  const openViewModal = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const getStatusIcon = (status, type, festival) => {
    if (status === 'festival') {
      return (
        <div 
          style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            cursor: 'pointer',
            margin: '0 auto'
          }}
          title={festival}
        >
          🎉
        </div>
      );
    } else if (status === 'present') {
      return type === 'half' ? (
        <Clock size={12} className="text-warning" />
      ) : (
        <CheckCircle size={12} className="text-success" />
      );
    } else if (status === 'absent') {
      return <XCircle size={12} className="text-danger" />;
    } else {
      return <div className="text-muted" style={{ fontSize: '8px' }}>-</div>;
    }
  };

  return (
    <div 
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh",
        padding: "10px"
      }}
    >
      {/* Header Card */}
      <div 
        className="card mb-3"
        style={{
          background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
          border: "1px solid rgba(63, 226, 205, 0.2)",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(63, 226, 205, 0.1)"
        }}
      >
        <div className="card-body p-2 p-md-3">
          <div className="row align-items-center g-2">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div className="d-flex align-items-center">
                <Calendar size={20} className="me-2" style={{ color: "#2c5f5d" }} />
                <div>
                  <h6 className="mb-0" style={{ color: "#2c5f5d", fontSize: "13px" }}>Attendance Management</h6>
                  <small className="text-muted" style={{ fontSize: "10px" }}>Track employee attendance</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="row g-2">
                <div className="col-6">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    style={{
                      background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                      border: "1px solid rgba(63, 226, 205, 0.3)",
                      borderRadius: "6px",
                      color: "#2c5f5d",
                      fontWeight: "500",
                      fontSize: "11px"
                    }}
                  >
                    {months.map((month, idx) => (
                      <option key={idx} value={idx}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <select
                    className="form-select form-select-sm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    style={{
                      background: "linear-gradient(to right, #ffffff80, #3fe2cd20)",
                      border: "1px solid rgba(63, 226, 205, 0.3)",
                      borderRadius: "6px",
                      color: "#2c5f5d",
                      fontWeight: "500",
                      fontSize: "11px"
                    }}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="d-md-none">
        {employees.map(emp => {
          const stats = calculateStats(emp.id);
          return (
            <div 
              key={emp.id}
              className="card mb-2"
              style={{
                background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
                border: "1px solid rgba(63, 226, 205, 0.2)",
                borderRadius: "10px"
              }}
            >
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                    <img 
                      src={emp.photo} 
                      alt={emp.name}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: "2px solid #3fe2cd",
                        marginRight: "8px",
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h6 className="mb-0 text-truncate" style={{ color: "#2c5f5d", fontSize: "12px" }}>{emp.name}</h6>
                      <small className="text-muted text-truncate d-block" style={{ fontSize: "10px" }}>{emp.designation}</small>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm ms-2"
                    style={{
                      background: "linear-gradient(45deg, #17a2b8, #20c997)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      width: "28px",
                      height: "28px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                    onClick={() => openViewModal(emp)}
                  >
                    <Eye size={12} />
                  </button>
                </div>
                
                <div className="row g-1 mb-2">
                  <div className="col-6">
                    <div 
                      className="p-2 text-center"
                      style={{
                        background: "linear-gradient(135deg, #28a74520, #20c99720)",
                        borderRadius: "6px"
                      }}
                    >
                      <div className="fw-bold" style={{ color: "#28a745", fontSize: "14px" }}>
                        {stats.present}
                      </div>
                      <small className="text-muted" style={{ fontSize: "9px" }}>Present</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div 
                      className="p-2 text-center"
                      style={{
                        background: "linear-gradient(135deg, #ffc10720, #fd7e1420)",
                        borderRadius: "6px"
                      }}
                    >
                      <div className="fw-bold" style={{ color: "#ffc107", fontSize: "14px" }}>
                        {stats.halfDay}
                      </div>
                      <small className="text-muted" style={{ fontSize: "9px" }}>Half Day</small>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                  <span className="badge bg-success" style={{ borderRadius: "12px", fontSize: "9px" }}>
                    {stats.attendanceRatio}%
                  </span>
                  <span className="badge bg-danger" style={{ borderRadius: "12px", fontSize: "9px" }}>
                    {stats.absent} Absent
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Table */}
      <div className="d-none d-md-block">
        <div 
          className="card"
          style={{
            background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
            border: "1px solid rgba(63, 226, 205, 0.2)",
            borderRadius: "10px",
            overflow: "hidden"
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="table table-hover table-sm mb-0">
              <thead style={{ 
                background: "linear-gradient(135deg, #3fe2cd25, #ffffff60)",
                position: "sticky",
                top: 0,
                zIndex: 10
              }}>
                <tr>
                  <th className="border-0 px-2 py-2" style={{ color: "#2c5f5d", minWidth: "140px", fontSize: "11px" }}>
                    Employee
                  </th>
                  {[...Array(daysInMonth)].map((_, idx) => (
                    <th 
                      key={idx} 
                      className="border-0 text-center py-2" 
                      style={{ 
                        color: "#2c5f5d",
                        fontSize: "9px",
                        minWidth: "24px",
                        padding: "8px 1px"
                      }}
                    >
                      {idx + 1}
                    </th>
                  ))}
                  <th className="border-0 px-2 py-2 text-center" style={{ color: "#2c5f5d", minWidth: "60px", fontSize: "11px" }}>
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid rgba(63, 226, 205, 0.1)" }}>
                    <td className="px-2 py-2">
                      <div className="d-flex align-items-center">
                        <img 
                          src={emp.photo} 
                          alt={emp.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            border: "2px solid #3fe2cd",
                            marginRight: "6px",
                            flexShrink: 0
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div className="fw-bold text-truncate" style={{ color: "#2c5f5d", fontSize: "11px" }}>
                            {emp.name}
                          </div>
                          <small className="text-truncate d-block" style={{ color: "#5a6c6b", fontSize: "9px" }}>{emp.designation}</small>
                        </div>
                      </div>
                    </td>
                    {(attendance[emp.id] || []).map((day, idx) => (
                      <td 
                        key={idx} 
                        className="text-center py-2"
                        style={{ padding: "6px 1px" }}
                      >
                        {getStatusIcon(day.status, day.type, day.festival)}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center">
                      <button
                        className="btn btn-sm"
                        style={{
                          background: "linear-gradient(45deg, #17a2b8, #20c997)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          width: "28px",
                          height: "28px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto"
                        }}
                        onClick={() => openViewModal(emp)}
                      >
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedEmployee && (
        <div 
          className="modal show d-block" 
          style={{ 
            background: "rgba(0,0,0,0.5)",
            overflowY: "auto",
            padding: "10px"
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ maxWidth: "850px", margin: "20px auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="modal-content"
              style={{
                background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                border: "1px solid rgba(63, 226, 205, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
              }}
            >
              <div 
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
                  borderBottom: "1px solid rgba(63, 226, 205, 0.3)",
                  borderRadius: "12px 12px 0 0",
                  padding: "12px 16px"
                }}
              >
                <h6 className="modal-title d-flex align-items-center mb-0" style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600" }}>
                  <User size={16} className="me-2" />
                  Employee Details
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  style={{ fontSize: "10px" }}
                ></button>
              </div>
              <div className="modal-body p-3">
                {/* Employee Info */}
                <div className="text-center mb-3">
                  <img 
                    src={selectedEmployee.photo} 
                    alt={selectedEmployee.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      border: "3px solid #3fe2cd",
                      marginBottom: "8px"
                    }}
                  />
                  <h6 className="mb-1" style={{ color: "#2c5f5d", fontSize: "16px", fontWeight: "600" }}>
                    {selectedEmployee.name}
                  </h6>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{selectedEmployee.designation}</p>
                </div>

                {/* Quick Info */}
                <div className="card mb-3" style={{
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  border: "1px solid rgba(63, 226, 205, 0.2)",
                  borderRadius: "8px"
                }}>
                  <div className="card-body p-2">
                    <div className="row g-2">
                      <div className="col-6 col-md-4">
                        <div className="d-flex align-items-center mb-1">
                          <Building2 size={12} className="me-1" style={{ color: "#3fe2cd" }} />
                          <small className="text-muted" style={{ fontSize: "10px" }}>Department</small>
                        </div>
                        <div style={{ color: "#2c5f5d", fontWeight: "600", fontSize: "11px" }}>
                          {selectedEmployee.department}
                        </div>
                      </div>
                      <div className="col-6 col-md-4">
                        <div className="d-flex align-items-center mb-1">
                          <Phone size={12} className="me-1" style={{ color: "#3fe2cd" }} />
                          <small className="text-muted" style={{ fontSize: "10px" }}>Phone</small>
                        </div>
                        <div style={{ color: "#2c5f5d", fontWeight: "600", fontSize: "11px" }}>
                          {selectedEmployee.phone.substring(0, 14)}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="d-flex align-items-center mb-1">
                          <Mail size={12} className="me-1" style={{ color: "#3fe2cd" }} />
                          <small className="text-muted" style={{ fontSize: "10px" }}>Email</small>
                        </div>
                        <div style={{ color: "#2c5f5d", fontWeight: "600", fontSize: "10px", wordBreak: "break-all" }}>
                          {selectedEmployee.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-3">
                  <h6 className="mb-2 d-flex align-items-center" style={{ color: "#2c5f5d", fontSize: "13px", fontWeight: "600" }}>
                    <Calendar size={14} className="me-1" style={{ color: "#3fe2cd" }} />
                    {months[selectedMonth]} {selectedYear} Summary
                  </h6>
                  <div className="row g-2">
                    {(() => {
                      const stats = calculateStats(selectedEmployee.id);
                      return (
                        <>
                          <div className="col-6 col-md-3">
                            <div className="card text-center" style={{
                              background: "linear-gradient(135deg, #28a74515, #20c99715)",
                              border: "1px solid rgba(40, 167, 69, 0.2)",
                              borderRadius: "8px"
                            }}>
                              <div className="card-body p-2">
                                <CheckCircle size={16} className="mb-1" style={{ color: "#28a745" }} />
                                <h6 className="mb-0" style={{ color: "#28a745", fontSize: "16px" }}>{stats.present}</h6>
                                <small style={{ color: "#28a745", fontSize: "9px", fontWeight: "500" }}>Present</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="card text-center" style={{
                              background: "linear-gradient(135deg, #ffc10715, #fd7e1415)",
                              border: "1px solid rgba(255, 193, 7, 0.2)",
                              borderRadius: "8px"
                            }}>
                              <div className="card-body p-2">
                                <Clock size={16} className="mb-1" style={{ color: "#ffc107" }} />
                                <h6 className="mb-0" style={{ color: "#ffc107", fontSize: "16px" }}>{stats.halfDay}</h6>
                                <small style={{ color: "#ffc107", fontSize: "9px", fontWeight: "500" }}>Half Days</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="card text-center" style={{
                              background: "linear-gradient(135deg, #dc354515, #c8233315)",
                              border: "1px solid rgba(220, 53, 69, 0.2)",
                              borderRadius: "8px"
                            }}>
                              <div className="card-body p-2">
                                <XCircle size={16} className="mb-1" style={{ color: "#dc3545" }} />
                                <h6 className="mb-0" style={{ color: "#dc3545", fontSize: "16px" }}>{stats.absent}</h6>
                                <small style={{ color: "#dc3545", fontSize: "9px", fontWeight: "500" }}>Absent</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="card text-center" style={{
                              background: "linear-gradient(135deg, #17a2b815, #20c99715)",
                              border: "1px solid rgba(23, 162, 184, 0.2)",
                              borderRadius: "8px"
                            }}>
                              <div className="card-body p-2">
                                <TrendingUp size={16} className="mb-1" style={{ color: "#17a2b8" }} />
                                <h6 className="mb-0" style={{ color: "#17a2b8", fontSize: "16px" }}>{stats.attendanceRatio}%</h6>
                                <small style={{ color: "#17a2b8", fontSize: "9px", fontWeight: "500" }}>Ratio</small>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Summary */}
                <div className="card" style={{
                  background: "linear-gradient(135deg, #3fe2cd08, #ffffff)",
                  border: "1px solid rgba(63, 226, 205, 0.2)",
                  borderRadius: "8px"
                }}>
                  <div className="card-body p-2">
                    <div className="row g-2">
                      <div className="col-4">
                        <div className="text-center">
                          <small className="text-muted d-block" style={{ fontSize: "9px" }}>Working Days</small>
                          <strong style={{ color: "#2c5f5d", fontSize: "14px" }}>
                            {calculateStats(selectedEmployee.id).workingDays}
                          </strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <small className="text-muted d-block" style={{ fontSize: "9px" }}>Weekends</small>
                          <strong style={{ color: "#2c5f5d", fontSize: "14px" }}>
                            {calculateStats(selectedEmployee.id).weekends}
                          </strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <small className="text-muted d-block" style={{ fontSize: "9px" }}>Festivals</small>
                          <strong style={{ color: "#2c5f5d", fontSize: "14px" }}>
                            {calculateStats(selectedEmployee.id).festivalDays}
                          </strong>
                        </div>
                      </div>
                      <div className="col-12 mt-2">
                        <div className="progress" style={{ height: "20px", borderRadius: "12px", background: "#e9ecef" }}>
                          <div 
                            className="progress-bar"
                            style={{
                              width: `${calculateStats(selectedEmployee.id).attendanceRatio}%`,
                              background: "linear-gradient(45deg, #28a745, #20c997)",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "600"
                            }}
                          >
                            {calculateStats(selectedEmployee.id).attendanceRatio}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="modal-footer"
                style={{
                  background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                  borderTop: "1px solid rgba(63, 226, 205, 0.2)",
                  borderRadius: "0 0 12px 12px",
                  padding: "10px 16px"
                }}
              >
                <button 
                  type="button" 
                  className="btn btn-sm w-100"
                  style={{
                    background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    padding: "6px 16px",
                    fontWeight: "500"
                  }}
                  onClick={() => setShowModal(false)}
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

export default AttendanceManagement;