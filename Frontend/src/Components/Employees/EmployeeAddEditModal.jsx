import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard as IdCard, User, Mail, Phone, MapPin, Calendar, Briefcase, 
  DollarSign, Building2, Image, CreditCard, FileText,
  Users, Clock, Award, Plus, X, Upload, Camera, Trash2
} from 'lucide-react';

const EmployeeAddEditModal = ({ 
  showModal, 
  setShowModal, 
  editingEmployee, 
  onSave,
  saving = false,
  departments = [],
  designations = []
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [educationQualifications, setEducationQualifications] = useState([]);
  const [selectedEducationType, setSelectedEducationType] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [govIdImagePreview, setGovIdImagePreview] = useState('');
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingGovIdImage, setUploadingGovIdImage] = useState(false);

  const profileImageInputRef = useRef(null);
  const govIdImageInputRef = useRef(null);

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
    Department_Id: '',
    Image_Path: '',
    Date_Of_Birth: '',
    Work_Experience: '0.0',
    Employee_Type: 'Fresher',
    Tenth_Roll_Number: '',
    Twelfth_Roll_Number: '',
    UG_Roll_Number: '',
    PG_Roll_Number: '',
    Diploma_Roll_Number: '',
    Aadhaar_Number: '',
    PAN_Number: '',
    Govt_Id_Proof_Path: '',
    Emergency_Contact_Number: '',
    Employee_Status: 'Active',
    Resigned_Date: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (editingEmployee) {
      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      const employeeData = {
        ...editingEmployee,
        Join_Date: formatDate(editingEmployee.Join_Date),
        Date_Of_Birth: formatDate(editingEmployee.Date_Of_Birth),
        Resigned_Date: formatDate(editingEmployee.Resigned_Date)
      };

      setFormData(employeeData);
      setProfileImagePreview(editingEmployee.Image_Path || '');
      setGovIdImagePreview(editingEmployee.Govt_Id_Proof_Path || '');
      
      // Initialize education qualifications from existing data
      const existingEducation = [];
      if (editingEmployee.UG_Roll_Number) {
        existingEducation.push({ type: 'UG', rollNumber: editingEmployee.UG_Roll_Number });
      }
      if (editingEmployee.PG_Roll_Number) {
        existingEducation.push({ type: 'PG', rollNumber: editingEmployee.PG_Roll_Number });
      }
      if (editingEmployee.Diploma_Roll_Number) {
        existingEducation.push({ type: 'Diploma', rollNumber: editingEmployee.Diploma_Roll_Number });
      }
      setEducationQualifications(existingEducation);
    } else {
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
        Department_Id: '',
        Image_Path: '',
        Date_Of_Birth: '',
        Work_Experience: '0.0',
        Employee_Type: 'Fresher',
        Tenth_Roll_Number: '',
        Twelfth_Roll_Number: '',
        UG_Roll_Number: '',
        PG_Roll_Number: '',
        Diploma_Roll_Number: '',
        Aadhaar_Number: '',
        PAN_Number: '',
        Govt_Id_Proof_Path: '',
        Emergency_Contact_Number: '',
        Employee_Status: 'Active',
        Resigned_Date: ''
      });
      setEducationQualifications([]);
      setProfileImagePreview('');
      setGovIdImagePreview('');
    }
    setFormErrors({});
    setActiveTab('personal');
  }, [editingEmployee, showModal]);

  const defaultDesignations = [
    'Software Engineer', 'Senior Software Engineer', 'Team Lead', 'Project Manager',
    'HR Manager', 'Business Analyst', 'Quality Assurance', 'DevOps Engineer',
    'Data Scientist', 'UI/UX Designer', 'Product Manager', 'System Administrator'
  ];

  const employeeTypes = ['Fresher', 'Intern', 'Contract', 'Permanent'];
  const employeeStatuses = ['Active', 'Inactive', 'On Leave', 'Resigned'];
  const educationTypes = ['UG', 'PG', 'Diploma'];

  // Use provided designations or fallback to default
  const availableDesignations = designations.length > 0 ? designations : defaultDesignations;

  // Image upload function - you can customize this based on your backend
  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/upload/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.imagePath; // Assuming your backend returns { imagePath: "url" }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload ${type === 'profile' ? 'profile' : 'government ID'} image`);
      return null;
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploadingProfileImage(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const imagePath = await uploadImage(file, 'profile');
    if (imagePath) {
      setFormData(prev => ({ ...prev, Image_Path: imagePath }));
    }
    
    setUploadingProfileImage(false);
  };

  // Handle government ID image upload
  const handleGovIdImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploadingGovIdImage(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setGovIdImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const imagePath = await uploadImage(file, 'government-id');
    if (imagePath) {
      setFormData(prev => ({ ...prev, Govt_Id_Proof_Path: imagePath }));
    }
    
    setUploadingGovIdImage(false);
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImagePreview('');
    setFormData(prev => ({ ...prev, Image_Path: '' }));
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Remove government ID image
  const removeGovIdImage = () => {
    setGovIdImagePreview('');
    setFormData(prev => ({ ...prev, Govt_Id_Proof_Path: '' }));
    if (govIdImageInputRef.current) {
      govIdImageInputRef.current.value = '';
    }
  };

  // Validation functions
  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time validation
    let error = '';
    
    if (name === 'Aadhaar_Number' && value && !validateAadhaar(value)) {
      error = 'Aadhaar number must be exactly 12 digits';
    } else if (name === 'PAN_Number' && value && !validatePAN(value)) {
      error = 'PAN must be in format: ABCDE1234F';
    } else if (name === 'Phone' && value && !validatePhone(value)) {
      error = 'Phone number must be exactly 10 digits';
    } else if (name === 'Emergency_Contact_Number' && value && !validatePhone(value)) {
      error = 'Emergency contact must be exactly 10 digits';
    } else if (name === 'Email' && value && !validateEmail(value)) {
      error = 'Please enter a valid email address';
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEducationQualification = () => {
    if (!selectedEducationType) return;
    
    const exists = educationQualifications.some(edu => edu.type === selectedEducationType);
    if (exists) {
      alert(`${selectedEducationType} qualification already added`);
      return;
    }

    setEducationQualifications(prev => [...prev, {
      type: selectedEducationType,
      rollNumber: ''
    }]);
    setSelectedEducationType('');
  };

  const updateEducationRollNumber = (index, rollNumber) => {
    setEducationQualifications(prev => prev.map((edu, i) => 
      i === index ? { ...edu, rollNumber } : edu
    ));

    // Update form data
    const educationType = educationQualifications[index].type;
    const fieldName = `${educationType}_Roll_Number`;
    setFormData(prev => ({
      ...prev,
      [fieldName]: rollNumber
    }));
  };

  const removeEducationQualification = (index) => {
    const educationType = educationQualifications[index].type;
    const fieldName = `${educationType}_Roll_Number`;
    
    setEducationQualifications(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const handleSave = () => {
    // Basic validation
    const errors = {};
    
    if (!formData.Employee_Id) errors.Employee_Id = 'Employee ID is required';
    if (!formData.First_Name) errors.First_Name = 'First Name is required';
    if (!formData.Last_Name) errors.Last_Name = 'Last Name is required';
    if (!formData.Email) errors.Email = 'Email is required';
    if (!formData.Phone) errors.Phone = 'Phone is required';
    if (!formData.Join_Date) errors.Join_Date = 'Join Date is required';
    if (!formData.Designation) errors.Designation = 'Designation is required';
    if (!formData.Department_Id) errors.Department_Id = 'Department is required';

    // Validation for specific fields
    if (formData.Aadhaar_Number && !validateAadhaar(formData.Aadhaar_Number)) {
      errors.Aadhaar_Number = 'Invalid Aadhaar number';
    }
    if (formData.PAN_Number && !validatePAN(formData.PAN_Number)) {
      errors.PAN_Number = 'Invalid PAN number';
    }
    if (formData.Phone && !validatePhone(formData.Phone)) {
      errors.Phone = 'Invalid phone number';
    }
    if (formData.Email && !validateEmail(formData.Email)) {
      errors.Email = 'Invalid email address';
    }
    if (formData.Emergency_Contact_Number && !validatePhone(formData.Emergency_Contact_Number)) {
      errors.Emergency_Contact_Number = 'Invalid emergency contact number';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Update form data with education qualifications
      const updatedFormData = { ...formData };
      educationQualifications.forEach(edu => {
        const fieldName = `${edu.type}_Roll_Number`;
        updatedFormData[fieldName] = edu.rollNumber;
      });

      onSave(updatedFormData);
    } else {
      // Focus on first error tab
      if (errors.Employee_Id || errors.First_Name || errors.Last_Name || errors.Email || errors.Phone || errors.Date_Of_Birth || errors.Emergency_Contact_Number) {
        setActiveTab('personal');
      } else if (errors.Join_Date || errors.Designation || errors.Department_Id) {
        setActiveTab('professional');
      } else if (errors.education) {
        setActiveTab('education');
      } else if (errors.Aadhaar_Number || errors.PAN_Number) {
        setActiveTab('documents');
      }
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const getAvailableEducationTypes = () => {
    return educationTypes.filter(type => 
      !educationQualifications.some(edu => edu.type === type)
    );
  };

  if (!showModal) return null;

  return (
    <div 
      className="modal show d-block" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1050
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '95vw',
          width: '100%',
          margin: '1rem auto'
        }}
      >
        <div 
          className="modal-content"
          style={{
            background: "#ffffff",
            border: "2px solid #3fe2cd",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header - Fixed */}
          <div 
            className="modal-header flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
              color: "white",
              borderRadius: "18px 18px 0 0",
              borderBottom: "none",
              padding: "1.25rem 1.5rem"
            }}
          >
            <h4 className="modal-title fw-bold mb-0 d-flex align-items-center">
              <User size={24} className="me-2" />
              <span className="d-none d-sm-inline">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </span>
              <span className="d-sm-none">
                {editingEmployee ? 'Edit' : 'Add'} Employee
              </span>
            </h4>
            <button 
              className="btn-close btn-close-white" 
              onClick={() => setShowModal(false)}
              disabled={saving}
            ></button>
          </div>

          {/* Body - Scrollable */}
          <div className="modal-body flex-grow-1 p-0 d-flex flex-column" style={{ background: "#ffffff", overflow: 'hidden' }}>
            {/* Tabs Navigation - Fixed */}
            <div className="flex-shrink-0 border-bottom">
              <div className="px-3 py-2" style={{ background: '#f8f9fa' }}>
                <div className="row g-1">
                  {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    const hasError = tab.id === 'personal' && (formErrors.Employee_Id || formErrors.First_Name || formErrors.Last_Name || formErrors.Email || formErrors.Phone || formErrors.Date_Of_Birth || formErrors.Emergency_Contact_Number) ||
                                     tab.id === 'professional' && (formErrors.Join_Date || formErrors.Designation || formErrors.Department_Id) ||
                                     tab.id === 'education' && formErrors.education ||
                                     tab.id === 'documents' && (formErrors.Aadhaar_Number || formErrors.PAN_Number);
                    
                    return (
                      <div className="col-6 col-md-3" key={tab.id}>
                        <button
                          className={`btn w-100 text-center fw-semibold ${activeTab === tab.id ? 'active' : ''} ${hasError ? 'text-danger' : ''}`}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            background: activeTab === tab.id ? '#3fe2cd' : 'transparent',
                            color: activeTab === tab.id ? 'white' : hasError ? '#dc3545' : '#6c757d',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            padding: '0.5rem',
                            border: 'none'
                          }}
                        >
                          <IconComponent size={16} className="d-block mx-auto mb-1" />
                          <span className="d-block">{tab.label}</span>
                          {hasError && <span className="d-block">⚠️</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content - Scrollable */}
            <div 
              className="flex-grow-1 p-3 p-md-4" 
              style={{ 
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 180px)'
              }}
            >
              
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="tab-content">
                  <h5 className="text-primary mb-3 d-flex align-items-center">
                    <User size={20} className="me-2" />
                    Personal Information
                  </h5>
                  
                  {/* Profile Image Upload Section */}
                  <div className="card mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '12px' }}>
                    <div className="card-header text-white" style={{ background: 'linear-gradient(45deg, #3fe2cd, #2c5f5d)', borderRadius: '11px 11px 0 0' }}>
                      <h6 className="mb-0 small fw-bold">
                        <Camera size={16} className="me-2" />
                        Profile Photo
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          {profileImagePreview ? (
                            <div className="position-relative">
                              <img 
                                src={profileImagePreview} 
                                alt="Profile Preview" 
                                className="img-thumbnail"
                                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                style={{ transform: 'translate(25%, -25%)', borderRadius: '50%', width: '30px', height: '30px' }}
                                onClick={removeProfileImage}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center bg-light border rounded"
                              style={{ width: '120px', height: '120px', borderRadius: '10px' }}
                            >
                              <Camera size={40} className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="col-md-8">
                          <input 
                            type="file" 
                            ref={profileImageInputRef}
                            className="form-control mb-2" 
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={uploadingProfileImage || saving}
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => profileImageInputRef.current?.click()}
                            disabled={uploadingProfileImage || saving}
                          >
                            {uploadingProfileImage ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={14} className="me-1" />
                                Choose Photo
                              </>
                            )}
                          </button>
                          <small className="text-muted d-block">
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <IdCard size={14} className="me-1" />
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.Employee_Id ? 'is-invalid' : ''}`}
                        name="Employee_Id"
                        value={formData.Employee_Id}
                        onChange={handleChange}
                        placeholder="Enter Employee ID"
                        disabled={saving}
                      />
                      {formErrors.Employee_Id && (
                        <div className="invalid-feedback">{formErrors.Employee_Id}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Calendar size={14} className="me-1" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="Date_Of_Birth"
                        value={formData.Date_Of_Birth}
                        onChange={handleChange}
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <User size={14} className="me-1" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.First_Name ? 'is-invalid' : ''}`}
                        name="First_Name"
                        value={formData.First_Name}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                        disabled={saving}
                      />
                      {formErrors.First_Name && (
                        <div className="invalid-feedback">{formErrors.First_Name}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <User size={14} className="me-1" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.Last_Name ? 'is-invalid' : ''}`}
                        name="Last_Name"
                        value={formData.Last_Name}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                        disabled={saving}
                      />
                      {formErrors.Last_Name && (
                        <div className="invalid-feedback">{formErrors.Last_Name}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Mail size={14} className="me-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`}
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        placeholder="Enter Email Address"
                        disabled={saving}
                      />
                      {formErrors.Email && (
                        <div className="invalid-feedback">{formErrors.Email}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Phone size={14} className="me-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.Phone ? 'is-invalid' : ''}`}
                        name="Phone"
                        value={formData.Phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit Phone Number"
                        maxLength="10"
                        disabled={saving}
                      />
                      {formErrors.Phone && (
                        <div className="invalid-feedback">{formErrors.Phone}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-secondary small">
                        <MapPin size={14} className="me-1" />
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        placeholder="Enter Full Address"
                        rows="2"
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Phone size={14} className="me-1" />
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.Emergency_Contact_Number ? 'is-invalid' : ''}`}
                        name="Emergency_Contact_Number"
                        value={formData.Emergency_Contact_Number}
                        onChange={handleChange}
                        placeholder="Enter 10-digit Emergency Contact"
                        maxLength="10"
                        disabled={saving}
                      />
                      {formErrors.Emergency_Contact_Number && (
                        <div className="invalid-feedback">{formErrors.Emergency_Contact_Number}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Information Tab */}
              {activeTab === 'professional' && (
                <div className="tab-content">
                  <h5 className="text-primary mb-3 d-flex align-items-center">
                    <Briefcase size={20} className="me-2" />
                    Professional Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Calendar size={14} className="me-1" />
                        Join Date *
                      </label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.Join_Date ? 'is-invalid' : ''}`}
                        name="Join_Date"
                        value={formData.Join_Date}
                        onChange={handleChange}
                        disabled={saving}
                      />
                      {formErrors.Join_Date && (
                        <div className="invalid-feedback">{formErrors.Join_Date}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Building2 size={14} className="me-1" />
                        Department *
                      </label>
                      <select
                        className={`form-select ${formErrors.Department_Id ? 'is-invalid' : ''}`}
                        name="Department_Id"
                        value={formData.Department_Id}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                      {formErrors.Department_Id && (
                        <div className="invalid-feedback">{formErrors.Department_Id}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Briefcase size={14} className="me-1" />
                        Designation *
                      </label>
                      <select
                        className={`form-select ${formErrors.Designation ? 'is-invalid' : ''}`}
                        name="Designation"
                        value={formData.Designation}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        <option value="">Select Designation</option>
                        {availableDesignations.map(designation => (
                          <option key={designation} value={designation}>{designation}</option>
                        ))}
                      </select>
                      {formErrors.Designation && (
                        <div className="invalid-feedback">{formErrors.Designation}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Users size={14} className="me-1" />
                        Employee Type
                      </label>
                      <select
                        className="form-select"
                        name="Employee_Type"
                        value={formData.Employee_Type}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        {employeeTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <DollarSign size={14} className="me-1" />
                        Basic Salary
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="Basic_Salary"
                        value={formData.Basic_Salary}
                        onChange={handleChange}
                        placeholder="Enter Basic Salary"
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Clock size={14} className="me-1" />
                        Work Experience (Years)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        name="Work_Experience"
                        value={formData.Work_Experience}
                        onChange={handleChange}
                        placeholder="Enter Work Experience"
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Users size={14} className="me-1" />
                        Employee Status
                      </label>
                      <select
                        className="form-select"
                        name="Employee_Status"
                        value={formData.Employee_Status}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        {employeeStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    {formData.Employee_Status === 'Resigned' && (
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <Calendar size={14} className="me-1" />
                          Resigned Date *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="Resigned_Date"
                          value={formData.Resigned_Date}
                          onChange={handleChange}
                          disabled={saving}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div className="tab-content">
                  <h5 className="text-primary mb-3 d-flex align-items-center">
                    <Award size={20} className="me-2" />
                    Educational Qualifications
                  </h5>
                  
                  {/* 10th and 12th (Always visible) */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Award size={14} className="me-1" />
                        10th Roll Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Tenth_Roll_Number"
                        value={formData.Tenth_Roll_Number}
                        onChange={handleChange}
                        placeholder="Enter 10th Roll Number"
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <Award size={14} className="me-1" />
                        12th Roll Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Twelfth_Roll_Number"
                        value={formData.Twelfth_Roll_Number}
                        onChange={handleChange}
                        placeholder="Enter 12th Roll Number"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Higher Education Section */}
                  <div className="card mb-3" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '10px' }}>
                    <div className="card-header text-white" style={{ background: 'linear-gradient(45deg, #3fe2cd, #2c5f5d)', borderRadius: '9px 9px 0 0' }}>
                      <h6 className="mb-0 small fw-bold">Higher Education Qualifications</h6>
                    </div>
                    <div className="card-body p-3">
                      {/* Add Education Dropdown */}
                      <div className="row mb-3 g-2">
                        <div className="col-8">
                          <select
                            className="form-select form-select-sm"
                            value={selectedEducationType}
                            onChange={(e) => setSelectedEducationType(e.target.value)}
                            disabled={saving}
                          >
                            <option value="">Select Education Type</option>
                            {getAvailableEducationTypes().map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm w-100"
                            onClick={addEducationQualification}
                            disabled={!selectedEducationType || saving}
                          >
                            <Plus size={14} className="me-1" />
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Education List */}
                      {educationQualifications.length === 0 ? (
                        <div className="text-center text-muted py-2">
                          <p className="small mb-1">No higher education qualifications added yet.</p>
                          <p className="small mb-0">Add UG/PG/Diploma qualifications above</p>
                        </div>
                      ) : (
                        educationQualifications.map((education, index) => (
                          <div key={index} className="row mb-2 align-items-center g-2">
                            <div className="col-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={education.type}
                                disabled
                                style={{ background: '#e9ecef', fontSize: '0.8rem' }}
                              />
                            </div>
                            <div className="col-7">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={education.rollNumber}
                                onChange={(e) => updateEducationRollNumber(index, e.target.value)}
                                placeholder={`${education.type} Roll Number`}
                                disabled={saving}
                              />
                            </div>
                            <div className="col-2">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => removeEducationQualification(index)}
                                disabled={saving}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="tab-content">
                  <h5 className="text-primary mb-3 d-flex align-items-center">
                    <FileText size={20} className="me-2" />
                    Document Information
                  </h5>
                  
                  {/* Government ID Upload Section */}
                  <div className="card mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '12px' }}>
                    <div className="card-header text-white" style={{ background: 'linear-gradient(45deg, #3fe2cd, #2c5f5d)', borderRadius: '11px 11px 0 0' }}>
                      <h6 className="mb-0 small fw-bold">
                        <FileText size={16} className="me-2" />
                        Government ID Proof
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          {govIdImagePreview ? (
                            <div className="position-relative">
                              <img 
                                src={govIdImagePreview} 
                                alt="Government ID Preview" 
                                className="img-thumbnail"
                                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                style={{ transform: 'translate(25%, -25%)', borderRadius: '50%', width: '30px', height: '30px' }}
                                onClick={removeGovIdImage}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center bg-light border rounded"
                              style={{ width: '150px', height: '100px', borderRadius: '8px' }}
                            >
                              <FileText size={30} className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="col-md-8">
                          <input 
                            type="file" 
                            ref={govIdImageInputRef}
                            className="form-control mb-2" 
                            accept="image/*"
                            onChange={handleGovIdImageUpload}
                            disabled={uploadingGovIdImage || saving}
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => govIdImageInputRef.current?.click()}
                            disabled={uploadingGovIdImage || saving}
                          >
                            {uploadingGovIdImage ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={14} className="me-1" />
                                Choose Document
                              </>
                            )}
                          </button>
                          <small className="text-muted d-block">
                            Upload Aadhaar, PAN, Passport, or other Government ID (Max 5MB)
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <CreditCard size={14} className="me-1" />
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.Aadhaar_Number ? 'is-invalid' : ''}`}
                        name="Aadhaar_Number"
                        value={formData.Aadhaar_Number}
                        onChange={handleChange}
                        placeholder="Enter 12-digit Aadhaar Number"
                        maxLength="12"
                        disabled={saving}
                      />
                      {formErrors.Aadhaar_Number && (
                        <div className="invalid-feedback">{formErrors.Aadhaar_Number}</div>
                      )}
                      <div className="form-text small">Format: 123456789012</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-secondary small">
                        <CreditCard size={14} className="me-1" />
                        PAN Number
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.PAN_Number ? 'is-invalid' : ''}`}
                        name="PAN_Number"
                        value={formData.PAN_Number}
                        onChange={handleChange}
                        placeholder="Enter PAN Number"
                        maxLength="10"
                        style={{ textTransform: 'uppercase' }}
                        disabled={saving}
                      />
                      {formErrors.PAN_Number && (
                        <div className="invalid-feedback">{formErrors.PAN_Number}</div>
                      )}
                      <div className="form-text small">Format: ABCDE1234F</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div 
            className="modal-footer flex-shrink-0 border-0" 
            style={{ 
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              borderRadius: "0 0 18px 18px",
              padding: "1rem 1.5rem"
            }}
          >
            <button 
              className="btn btn-secondary px-3 py-2"
              onClick={() => setShowModal(false)}
              disabled={saving}
              style={{ borderRadius: '10px', fontSize: '0.9rem' }}
            >
              Cancel
            </button>
            <button 
              className="btn px-3 py-2 ms-2"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(63, 226, 205, 0.3)",
                fontSize: '0.9rem'
              }}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                editingEmployee ? 'Update Employee' : 'Save Employee'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddEditModal;