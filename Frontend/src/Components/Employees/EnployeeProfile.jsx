import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext'; // Import the auth context
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Building2,
  Edit3, Camera, Save, X, Award, FileText, CreditCard,
  DollarSign, Clock, Users, Star, Trophy, Target, Activity,
  Download, Upload, Eye, AlertCircle, CheckCircle, Book,
  Trash2
} from 'lucide-react';

const EmployeeProfile = () => {
  const { user } = useAuth(); // Get user from auth context
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  
  const profileImageInputRef = useRef(null);

  const [editData, setEditData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Phone: '',
    Address: '',
    Emergency_Contact_Number: '',
    Image_Path: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Enhanced function to get employee ID with better debugging
  const getEmployeeId = () => {
    console.log('=== Getting Employee ID ===');
    
    // Method 1: From auth context
    if (user) {
      console.log('User from context:', user);
      if (user.userId) {
        console.log('Found userId in context:', user.userId);
        return user.userId;
      }
      if (user.employeeId) {
        console.log('Found employeeId in context:', user.employeeId);
        return user.employeeId;
      }
      if (user.User_Id) {
        console.log('Found User_Id in context:', user.User_Id);
        return user.User_Id;
      }
    }
    
    // Method 2: From localStorage user data
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('User from localStorage:', parsedUser);
        
        if (parsedUser.userId) {
          console.log('Found userId in localStorage:', parsedUser.userId);
          return parsedUser.userId;
        }
        if (parsedUser.employeeId) {
          console.log('Found employeeId in localStorage:', parsedUser.employeeId);
          return parsedUser.employeeId;
        }
        if (parsedUser.User_Id) {
          console.log('Found User_Id in localStorage:', parsedUser.User_Id);
          return parsedUser.User_Id;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage user:', error);
    }
    
    // Method 3: From token payload
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        
        // Try different possible field names
        const possibleIds = [
          payload.employeeId,
          payload.userId, 
          payload.User_Id,
          payload.id,
          payload.Employee_Id
        ];
        
        for (let id of possibleIds) {
          if (id) {
            console.log('Found ID in token:', id);
            return id;
          }
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    console.log('No employee ID found anywhere!');
    return null;
  };

  // Debug useEffect
  useEffect(() => {
    console.log('=== EMPLOYEE PROFILE DEBUG ===');
    console.log('User from context:', user);
    console.log('LocalStorage user:', localStorage.getItem('user'));
    console.log('LocalStorage token exists:', !!localStorage.getItem('token'));
    
    const employeeId = getEmployeeId();
    console.log('Resolved employee ID:', employeeId);
    
    if (employeeId) {
      fetchEmployeeProfile();
    } else {
      setError('Unable to identify logged-in employee. Please login again.');
      setLoading(false);
    }
  }, [user]);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const employeeId = getEmployeeId();
      
      console.log('Fetching profile for employee ID:', employeeId);
      
      if (!employeeId) {
        throw new Error('Employee ID not found. Please login again.');
      }
      
      const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Employee profile not found. Please contact administrator.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. You can only view your own profile.');
        }
        throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Employee data received:', data);
      
      setEmployeeData(data);
      setEditData({
        First_Name: data.First_Name || '',
        Last_Name: data.Last_Name || '',
        Email: data.Email || '',
        Phone: data.Phone || '',
        Address: data.Address || '',
        Emergency_Contact_Number: data.Emergency_Contact_Number || '',
        Image_Path: data.Image_Path || ''
      });
      setProfileImagePreview(data.Image_Path || '');
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component code remains the same...
  // (I'll keep the rest of the functions unchanged for brevity)

  // Image upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/upload/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.imagePath;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload profile image');
      return null;
    }
  };

  // Handle profile image upload
 // Handle profile image upload
 const handleProfileImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('File size should be less than 5MB');
    return;
  }

  setUploadingImage(true);
  
  try {
    // Create preview first
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server and get the path
    const imagePath = await uploadImage(file);
    if (imagePath) {
      // Update editData with the server path
      setEditData(prev => ({ ...prev, Image_Path: imagePath }));
      console.log('Image uploaded successfully:', imagePath);
    } else {
      // Reset preview if upload failed
      setProfileImagePreview(employeeData.Image_Path || '');
      alert('Failed to upload image. Please try again.');
    }
  } catch (error) {
    console.error('Error in image upload:', error);
    setProfileImagePreview(employeeData.Image_Path || '');
    alert('Error uploading image. Please try again.');
  } finally {
    setUploadingImage(false);
  }
};

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImagePreview('');
    setEditData(prev => ({ ...prev, Image_Path: '' }));
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Validation functions
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({
      First_Name: employeeData.First_Name || '',
      Last_Name: employeeData.Last_Name || '',
      Email: employeeData.Email || '',
      Phone: employeeData.Phone || '',
      Address: employeeData.Address || '',
      Emergency_Contact_Number: employeeData.Emergency_Contact_Number || '',
      Image_Path: employeeData.Image_Path || ''
    });
    setProfileImagePreview(employeeData.Image_Path || '');
    setFormErrors({});
  };

  const handleSave = async () => {
    // Validation
    const errors = {};
    
    if (!editData.First_Name.trim()) errors.First_Name = 'First name is required';
    if (!editData.Last_Name.trim()) errors.Last_Name = 'Last name is required';
    if (!editData.Email.trim()) errors.Email = 'Email is required';
    else if (!validateEmail(editData.Email)) errors.Email = 'Invalid email format';
    if (!editData.Phone.trim()) errors.Phone = 'Phone number is required';
    else if (!validatePhone(editData.Phone)) errors.Phone = 'Phone number must be 10 digits';
    if (editData.Emergency_Contact_Number && !validatePhone(editData.Emergency_Contact_Number)) {
      errors.Emergency_Contact_Number = 'Emergency contact must be 10 digits';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const employeeId = getEmployeeId();
      
      if (!employeeId) {
        throw new Error('Employee ID not found. Please login again.');
      }
      
      const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchEmployeeProfile();
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const achievements = [
    { id: 1, title: "Employee of the Month", date: "March 2024", icon: Trophy, color: "#ffc107" },
    { id: 2, title: "Project Excellence Award", date: "January 2024", icon: Star, color: "#28a745" },
    { id: 3, title: "Team Player Award", date: "November 2023", icon: Users, color: "#17a2b8" },
    { id: 4, title: "Innovation Award", date: "September 2023", icon: Target, color: "#dc3545" }
  ];

  const quickActions = [
    { id: 1, title: "Download Profile", icon: Download, action: () => window.print() },
    { id: 2, title: "View Payslips", icon: FileText, action: () => alert('Payslips feature coming soon') },
    { id: 3, title: "Leave History", icon: Calendar, action: () => alert('Leave history feature coming soon') },
    { id: 4, title: "Certificates", icon: Award, action: () => alert('Certificates feature coming soon') }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" style={{ color: '#3fe2cd !important' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="alert alert-danger text-center">
          <AlertCircle size={32} className="mb-2" />
          <h4>Error Loading Profile</h4>
          <p>{error}</p>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={fetchEmployeeProfile}>
              Retry
            </button>
            <button className="btn btn-secondary" onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
              Clear Data & Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="alert alert-warning text-center">
          <h4>No Employee Data Found</h4>
          <p>Unable to load employee profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-3 p-md-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "20px",
              border: "1px solid rgba(63, 226, 205, 0.2)"
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="position-relative me-md-4 mb-3 mb-md-0">
                      <img
                        src={editMode && profileImagePreview ? profileImagePreview : (employeeData.Image_Path || "https://via.placeholder.com/150")}
                        alt="Profile"
                        className="rounded-circle border border-3"
                        style={{ 
                          width: "120px", 
                          height: "120px", 
                          objectFit: "cover",
                          borderColor: "#3fe2cd !important"
                        }}
                      />
                      {editMode && (
                        <>
                          <input 
                            type="file" 
                            ref={profileImageInputRef}
                            className="d-none" 
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={uploadingImage}
                          />
                          <button 
                            type="button"
                            className="btn btn-primary btn-sm rounded-circle position-absolute"
                            style={{ 
                              width: "35px", 
                              height: "35px",
                              bottom: "0",
                              right: "0",
                              background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                              border: "none"
                            }}
                            onClick={() => profileImageInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }}></span>
                            ) : (
                              <Camera size={16} />
                            )}
                          </button>
                          {profileImagePreview && (
                            <button 
                              type="button"
                              className="btn btn-danger btn-sm rounded-circle position-absolute"
                              style={{ 
                                width: "30px", 
                                height: "30px",
                                top: "0",
                                right: "0",
                                transform: "translate(25%, -25%)"
                              }}
                              onClick={removeProfileImage}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-center text-md-start">
                      <h3 className="mb-2 fw-bold" style={{ color: "#2c5f5d" }}>
                        {employeeData.First_Name} {employeeData.Last_Name}
                      </h3>
                      <p className="mb-2 text-muted fs-5">
                        {employeeData.Designation}
                      </p>
                      <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
                        <div className="d-flex align-items-center">
                          <Building2 size={16} className="me-2 text-muted" />
                          <span className="small text-muted">{employeeData.Department_Name}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          <span className="small text-muted">
                            Joined {new Date(employeeData.Join_Date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Clock size={16} className="me-2 text-muted" />
                          <span className="small text-muted">{employeeData.Work_Experience} years exp.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  {!editMode ? (
                    <button 
                      className="btn btn-lg"
                      style={{
                        background: "linear-gradient(45deg, #3fe2cd, #2c5f5d)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(63, 226, 205, 0.3)"
                      }}
                      onClick={handleEdit}
                    >
                      <Edit3 size={18} className="me-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="d-flex gap-2 justify-content-center justify-content-md-end">
                      <button 
                        className="btn btn-success"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ borderRadius: "10px" }}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-1" />
                            Save
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={saving}
                        style={{ borderRadius: "10px" }}
                      >
                        <X size={16} className="me-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-6 col-lg-3 mb-3">
          <div 
            className="card border-0 shadow-sm h-100 text-center"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px",
              border: "1px solid rgba(63, 226, 205, 0.2)"
            }}
          >
            <div className="card-body p-3">
              <div className="text-primary fs-2 fw-bold">₹{parseInt(employeeData.Basic_Salary || 0).toLocaleString()}</div>
              <div className="text-muted small">Monthly Salary</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div 
            className="card border-0 shadow-sm h-100 text-center"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #20c99715)",
              borderRadius: "15px",
              border: "1px solid rgba(32, 201, 151, 0.2)"
            }}
          >
            <div className="card-body p-3">
              <div className="text-success fs-2 fw-bold">96%</div>
              <div className="text-muted small">Attendance Rate</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div 
            className="card border-0 shadow-sm h-100 text-center"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #ffc10715)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 193, 7, 0.2)"
            }}
          >
            <div className="card-body p-3">
              <div className="text-warning fs-2 fw-bold">4.8</div>
              <div className="text-muted small">Performance Rating</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div 
            className="card border-0 shadow-sm h-100 text-center"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #28a74515)",
              borderRadius: "15px",
              border: "1px solid rgba(40, 167, 69, 0.2)"
            }}
          >
            <div className="card-body p-3">
              <div className="text-success fs-2 fw-bold">15</div>
              <div className="text-muted small">Projects Done</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Profile Content */}
        <div className="col-lg-8">
          {/* Tabs Navigation */}
          <div 
            className="card border-0 shadow-sm mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px",
              border: "1px solid rgba(63, 226, 205, 0.2)"
            }}
          >
            <div className="card-body p-0">
              {/* Tab Headers */}
              <div className="px-3 py-2" style={{ background: '#f8f9fa', borderRadius: '15px 15px 0 0' }}>
                <div className="row g-1">
                  {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <div className="col-6 col-md-3" key={tab.id}>
                        <button
                          className={`btn w-100 text-center fw-semibold ${activeTab === tab.id ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            background: activeTab === tab.id ? '#3fe2cd' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#6c757d',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            padding: '0.5rem',
                            border: 'none'
                          }}
                        >
                          <IconComponent size={16} className="d-block mx-auto mb-1" />
                          <span className="d-block">{tab.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="tab-content">
                    <h5 className="text-primary mb-4 d-flex align-items-center">
                      <User size={20} className="me-2" />
                      Personal Information
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <User size={14} className="me-1" />
                          First Name *
                        </label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              className={`form-control ${formErrors.First_Name ? 'is-invalid' : ''}`}
                              name="First_Name"
                              value={editData.First_Name}
                              onChange={handleInputChange}
                              placeholder="Enter first name"
                            />
                            {formErrors.First_Name && (
                              <div className="invalid-feedback">{formErrors.First_Name}</div>
                            )}
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-semibold">{employeeData.First_Name}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <User size={14} className="me-1" />
                          Last Name *
                        </label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              className={`form-control ${formErrors.Last_Name ? 'is-invalid' : ''}`}
                              name="Last_Name"
                              value={editData.Last_Name}
                              onChange={handleInputChange}
                              placeholder="Enter last name"
                            />
                            {formErrors.Last_Name && (
                              <div className="invalid-feedback">{formErrors.Last_Name}</div>
                            )}
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-semibold">{employeeData.Last_Name}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <Mail size={14} className="me-1" />
                          Email Address *
                        </label>
                        {editMode ? (
                          <div>
                            <input
                              type="email"
                              className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`}
                              name="Email"
                              value={editData.Email}
                              onChange={handleInputChange}
                              placeholder="Enter email address"
                            />
                            {formErrors.Email && (
                              <div className="invalid-feedback">{formErrors.Email}</div>
                            )}
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-semibold">{employeeData.Email}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <Phone size={14} className="me-1" />
                          Phone Number *
                        </label>
                        {editMode ? (
                          <div>
                            <input
                              type="tel"
                              className={`form-control ${formErrors.Phone ? 'is-invalid' : ''}`}
                              name="Phone"
                              value={editData.Phone}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit phone number"
                              maxLength="10"
                            />
                            {formErrors.Phone && (
                              <div className="invalid-feedback">{formErrors.Phone}</div>
                            )}
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-semibold">{employeeData.Phone}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <Calendar size={14} className="me-1" />
                          Date of Birth
                        </label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.Date_Of_Birth ? new Date(employeeData.Date_Of_Birth).toLocaleDateString() : 'Not provided'}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">
                          <Phone size={14} className="me-1" />
                          Emergency Contact
                        </label>
                        {editMode ? (
                          <div>
                            <input
                              type="tel"
                              className={`form-control ${formErrors.Emergency_Contact_Number ? 'is-invalid' : ''}`}
                              name="Emergency_Contact_Number"
                              value={editData.Emergency_Contact_Number}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit emergency contact"
                              maxLength="10"
                            />
                            {formErrors.Emergency_Contact_Number && (
                              <div className="invalid-feedback">{formErrors.Emergency_Contact_Number}</div>
                            )}
                          </div>
                        ) : (
                          <div className="form-control-plaintext fw-semibold">
                            {employeeData.Emergency_Contact_Number || 'Not provided'}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary small">
                          <MapPin size={14} className="me-1" />
                          Address
                        </label>
                        {editMode ? (
                          <textarea
                            className="form-control"
                            name="Address"
                            value={editData.Address}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Enter full address"
                          />
                        ) : (
                          <div className="form-control-plaintext fw-semibold">
                            {employeeData.Address || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Information Tab */}
                {activeTab === 'professional' && (
                  <div className="tab-content">
                    <h5 className="text-primary mb-4 d-flex align-items-center">
                      <Briefcase size={20} className="me-2" />
                      Professional Information
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Employee ID</label>
                        <div className="form-control-plaintext fw-semibold">{employeeData.Employee_Id}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Designation</label>
                        <div className="form-control-plaintext fw-semibold">{employeeData.Designation}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Department</label>
                        <div className="form-control-plaintext fw-semibold">{employeeData.Department_Name}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Employee Type</label>
                        <div className="form-control-plaintext fw-semibold">{employeeData.Employee_Type}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Join Date</label>
                        <div className="form-control-plaintext fw-semibold">
                          {new Date(employeeData.Join_Date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Work Experience</label>
                        <div className="form-control-plaintext fw-semibold">{employeeData.Work_Experience} years</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Employment Status</label>
                        <div className="form-control-plaintext fw-semibold">
                          <span className={`badge rounded-pill px-3 py-2 ${employeeData.Employee_Status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                            {employeeData.Employee_Status}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Basic Salary</label>
                        <div className="form-control-plaintext fw-semibold">₹{parseInt(employeeData.Basic_Salary || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="tab-content">
                    <h5 className="text-primary mb-4 d-flex align-items-center">
                      <Book size={20} className="me-2" />
                      Educational Details
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">10th Roll Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.Tenth_Roll_Number || 'Not provided'}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">12th Roll Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.Twelfth_Roll_Number || 'Not provided'}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">UG Roll Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.UG_Roll_Number || 'Not provided'}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">PG Roll Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.PG_Roll_Number || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="tab-content">
                    <h5 className="text-primary mb-4 d-flex align-items-center">
                      <FileText size={20} className="me-2" />
                      Documents
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">Aadhaar Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.Aadhaar_Number || 'Not provided'}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary small">PAN Number</label>
                        <div className="form-control-plaintext fw-semibold">
                          {employeeData.PAN_Number || 'Not provided'}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-secondary small">Govt. ID Proof</label>
                        <div className="mt-2">
                          {employeeData.Govt_Id_Proof_Path ? (
                            <a 
                              href={employeeData.Govt_Id_Proof_Path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary"
                            >
                              <Eye size={16} className="me-2" />
                              View Document
                            </a>
                          ) : (
                            <span className="text-muted">No document uploaded.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="col-lg-4">
          {/* Quick Actions */}
          <div 
            className="card border-0 shadow-sm mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #20c99715)",
              borderRadius: "15px",
              border: "1px solid rgba(32, 201, 151, 0.2)"
            }}
          >
            <div className="card-body">
              <h5 className="mb-3 text-success d-flex align-items-center">
                <Activity size={20} className="me-2" />
                Quick Actions
              </h5>
              <div className="list-group list-group-flush">
                {quickActions.map(action => (
                  <button 
                    key={action.id}
                    className="list-group-item list-group-item-action d-flex align-items-center py-2 px-0"
                    onClick={action.action}
                  >
                    <div className="me-3" style={{ color: "#20c997" }}>
                      <action.icon size={20} />
                    </div>
                    <span className="fw-semibold">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div 
            className="card border-0 shadow-sm mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #ffc10715)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 193, 7, 0.2)"
            }}
          >
            <div className="card-body">
              <h5 className="mb-3 text-warning d-flex align-items-center">
                <Trophy size={20} className="me-2" />
                Achievements
              </h5>
              <div className="list-group list-group-flush">
                {achievements.map(achievement => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id}
                      className="list-group-item d-flex align-items-center py-2 px-0"
                    >
                      <div className="me-3" style={{ color: achievement.color }}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div className="fw-semibold">{achievement.title}</div>
                        <div className="small text-muted">{achievement.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;