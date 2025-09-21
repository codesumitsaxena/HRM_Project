import React from 'react';
import { 
  CreditCard as IdCard, User, Mail, Phone, MapPin, Calendar, Briefcase, 
  DollarSign, Building2, Image, CreditCard, FileText,
  Users, Clock, Award
} from 'lucide-react';

const EmployeeViewModal = ({ 
  showViewModal, 
  setShowViewModal, 
  viewingEmployee,
  getDepartmentName 
}) => {
  
  if (!showViewModal || !viewingEmployee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return `₹${parseInt(salary).toLocaleString('en-IN')}`;
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1050
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div 
          className="modal-content"
          style={{
            background: "#ffffff",
            border: "2px solid #17a2b8",
            borderRadius: "15px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            maxHeight: '95vh'
          }}
        >
          <div 
            className="modal-header"
            style={{
              background: "linear-gradient(135deg, #17a2b8, #20c997)",
              color: "white",
              borderRadius: "13px 13px 0 0",
              borderBottom: "none",
              padding: "1.5rem"
            }}
          >
            <h4 className="modal-title fw-bold mb-0">
              <User size={24} className="me-2" />
              Employee Details
            </h4>
            <button 
              className="btn-close btn-close-white" 
              onClick={() => setShowViewModal(false)}
            ></button>
          </div>

          <div className="modal-body p-4" style={{ background: "#ffffff", maxHeight: '70vh', overflowY: 'auto' }}>
            
            {/* Employee Photo Section */}
            {viewingEmployee.Image_Path && (
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img 
                    src={viewingEmployee.Image_Path} 
                    alt="Employee" 
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "4px solid #17a2b8",
                      boxShadow: "0 8px 25px rgba(23, 162, 184, 0.3)"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div 
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "3px solid white"
                    }}
                  >
                    <span className="text-white fw-bold">{viewingEmployee.Employee_Status === 'Active' ? '✓' : '!'}</span>
                  </div>
                </div>
                <h5 className="mt-3 mb-1" style={{ color: "#2c5f5d" }}>
                  {viewingEmployee.First_Name} {viewingEmployee.Last_Name}
                </h5>
                <p className="text-muted mb-3">{viewingEmployee.Designation}</p>
                <div className="d-flex justify-content-center gap-3">
                  <span 
                    className="badge px-3 py-2"
                    style={{ 
                      background: "linear-gradient(45deg, #17a2b8, #20c997)",
                      fontSize: "0.9rem"
                    }}
                  >
                    ID: {viewingEmployee.Employee_Id}
                  </span>
                  <span 
                    className={`badge px-3 py-2 ${
                      viewingEmployee.Employee_Status === 'Active' ? 'bg-success' : 
                      viewingEmployee.Employee_Status === 'Resigned' ? 'bg-danger' : 
                      viewingEmployee.Employee_Status === 'On Leave' ? 'bg-warning' : 'bg-secondary'
                    }`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {viewingEmployee.Employee_Status}
                  </span>
                </div>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="card mb-4" style={{ border: '1px solid rgba(23, 162, 184, 0.2)' }}>
              <div 
                className="card-header"
                style={{ 
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white"
                }}
              >
                <h6 className="mb-0">
                  <User size={18} className="me-2" />
                  Personal Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <IdCard size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Employee ID:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Employee_Id || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Date of Birth:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {formatDate(viewingEmployee.Date_Of_Birth)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Mail size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Email Address:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Email || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Phone size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Phone Number:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Phone || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Phone size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Emergency Contact:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Emergency_Contact_Number || 'N/A'}
                    </p>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-2">
                      <MapPin size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Address:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Address || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="card mb-4" style={{ border: '1px solid rgba(23, 162, 184, 0.2)' }}>
              <div 
                className="card-header"
                style={{ 
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white"
                }}
              >
                <h6 className="mb-0">
                  <Briefcase size={18} className="me-2" />
                  Professional Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Join Date:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {formatDate(viewingEmployee.Join_Date)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Building2 size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Department:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {getDepartmentName ? getDepartmentName(viewingEmployee.Department_Id) : 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Briefcase size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Designation:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Designation || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Users size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Employee Type:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Employee_Type || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <DollarSign size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Basic Salary:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {formatSalary(viewingEmployee.Basic_Salary)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Work Experience:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Work_Experience ? `${viewingEmployee.Work_Experience} years` : 'N/A'}
                    </p>
                  </div>
                  {viewingEmployee.Employee_Status === 'Resigned' && viewingEmployee.Resigned_Date && (
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Calendar size={16} className="me-2 text-danger" />
                        <strong className="text-secondary">Resigned Date:</strong>
                      </div>
                      <p className="mb-0 p-2 rounded" style={{ 
                        background: "#f8f9fa",
                        border: "1px solid #dc3545",
                        color: "#dc3545"
                      }}>
                        {formatDate(viewingEmployee.Resigned_Date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Information Section */}
            <div className="card mb-4" style={{ border: '1px solid rgba(23, 162, 184, 0.2)' }}>
              <div 
                className="card-header"
                style={{ 
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white"
                }}
              >
                <h6 className="mb-0">
                  <Award size={18} className="me-2" />
                  Educational Qualifications
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Award size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">10th Roll Number:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Tenth_Roll_Number || 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Award size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">12th Roll Number:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Twelfth_Roll_Number || 'N/A'}
                    </p>
                  </div>
                  {viewingEmployee.UG_Roll_Number && (
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Award size={16} className="me-2 text-success" />
                        <strong className="text-secondary">UG Roll Number:</strong>
                      </div>
                      <p className="mb-0 p-2 rounded" style={{ 
                        background: "#f8f9fa",
                        border: "1px solid #28a745",
                        color: "#28a745"
                      }}>
                        {viewingEmployee.UG_Roll_Number}
                      </p>
                    </div>
                  )}
                  {viewingEmployee.PG_Roll_Number && (
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Award size={16} className="me-2 text-success" />
                        <strong className="text-secondary">PG Roll Number:</strong>
                      </div>
                      <p className="mb-0 p-2 rounded" style={{ 
                        background: "#f8f9fa",
                        border: "1px solid #28a745",
                        color: "#28a745"
                      }}>
                        {viewingEmployee.PG_Roll_Number}
                      </p>
                    </div>
                  )}
                  {viewingEmployee.Diploma_Roll_Number && (
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Award size={16} className="me-2 text-success" />
                        <strong className="text-secondary">Diploma Roll Number:</strong>
                      </div>
                      <p className="mb-0 p-2 rounded" style={{ 
                        background: "#f8f9fa",
                        border: "1px solid #28a745",
                        color: "#28a745"
                      }}>
                        {viewingEmployee.Diploma_Roll_Number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Information Section */}
            <div className="card mb-4" style={{ border: '1px solid rgba(23, 162, 184, 0.2)' }}>
              <div 
                className="card-header"
                style={{ 
                  background: "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white"
                }}
              >
                <h6 className="mb-0">
                  <FileText size={18} className="me-2" />
                  Document Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <CreditCard size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Aadhaar Number:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Aadhaar_Number ? 
                        `XXXX XXXX ${viewingEmployee.Aadhaar_Number.slice(-4)}` : 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <CreditCard size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">PAN Number:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.PAN_Number ? 
                        `${viewingEmployee.PAN_Number.slice(0, 3)}XXXXXX${viewingEmployee.PAN_Number.slice(-1)}` : 'N/A'}
                    </p>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-2">
                      <FileText size={16} className="me-2 text-primary" />
                      <strong className="text-secondary">Government ID Proof:</strong>
                    </div>
                    <p className="mb-0 p-2 rounded" style={{ 
                      background: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      color: "#2c5f5d"
                    }}>
                      {viewingEmployee.Govt_Id_Proof_Path || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="modal-footer border-0" 
            style={{ 
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              borderRadius: "0 0 13px 13px",
              padding: "1.5rem"
            }}
          >
            <button 
              className="btn btn-lg px-4"
              onClick={() => setShowViewModal(false)}
              style={{
                background: "linear-gradient(45deg, #17a2b8, #20c997)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(23, 162, 184, 0.3)"
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;