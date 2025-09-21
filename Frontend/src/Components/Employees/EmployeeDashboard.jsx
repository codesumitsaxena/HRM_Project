import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Clock, DollarSign, Award, TrendingUp,
  Bell, CheckCircle, AlertCircle, BookOpen, Target, Users,
  BarChart3, PieChart, Activity, Mail, Phone, MapPin,
  Briefcase, Building2, Star, Coffee, Zap
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchEmployeeData();
    return () => clearInterval(timer);
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/employee/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployeeData(data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockEmployee = {
    Employee_Id: "EMP001",
    First_Name: "John",
    Last_Name: "Doe",
    Email: "john.doe@company.com",
    Phone: "9876543210",
    Designation: "Senior Software Engineer",
    Department_Id: 1,
    Department_Name: "IT",
    Image_Path: "https://via.placeholder.com/150",
    Join_Date: "2022-01-15",
    Basic_Salary: 75000,
    Employee_Status: "Active"
  };

  const employee = employeeData || mockEmployee;

  const stats = [
    {
      title: "Days at Company",
      value: employee.Join_Date ? Math.floor((new Date() - new Date(employee.Join_Date)) / (1000 * 60 * 60 * 24)) : "0",
      icon: Calendar,
      color: "#3fe2cd",
      bgColor: "rgba(63, 226, 205, 0.1)"
    },
    {
      title: "Current Month Hours",
      value: "168",
      icon: Clock,
      color: "#20c997",
      bgColor: "rgba(32, 201, 151, 0.1)"
    },
    {
      title: "Projects Completed",
      value: "12",
      icon: CheckCircle,
      color: "#28a745",
      bgColor: "rgba(40, 167, 69, 0.1)"
    },
    {
      title: "Performance Score",
      value: "4.8",
      icon: Star,
      color: "#ffc107",
      bgColor: "rgba(255, 193, 7, 0.1)"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Project Alpha Completed",
      time: "2 hours ago",
      type: "success",
      icon: CheckCircle
    },
    {
      id: 2,
      title: "Team Meeting Scheduled",
      time: "4 hours ago",
      type: "info",
      icon: Users
    },
    {
      id: 3,
      title: "Performance Review Due",
      time: "1 day ago",
      type: "warning",
      icon: AlertCircle
    },
    {
      id: 4,
      title: "Training Course Enrolled",
      time: "2 days ago",
      type: "info",
      icon: BookOpen
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Client Presentation Prep",
      dueDate: "Today, 3:00 PM",
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Code Review - Feature X",
      dueDate: "Tomorrow, 10:00 AM",
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Weekly Report Submission",
      dueDate: "Friday, 5:00 PM",
      priority: "low",
      completed: true
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
              borderRadius: "20px"
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="me-4">
                      <img
                        src={employee.Image_Path || "https://via.placeholder.com/80"}
                        alt="Profile"
                        className="rounded-circle border border-white border-3"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="text-white">
                      <h3 className="mb-1 fw-bold">
                        Welcome back, {employee.First_Name}!
                      </h3>
                      <p className="mb-2 opacity-90">
                        {employee.Designation} • {employee.Department_Name} Department
                      </p>
                      <div className="d-flex align-items-center">
                        <Coffee size={16} className="me-2" />
                        <span className="small">
                          {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <div className="d-flex d-md-block justify-content-around">
                    <div className="text-center text-white mb-2">
                      <div className="fs-4 fw-bold">28°C</div>
                      <div className="small opacity-90">Office Temp</div>
                    </div>
                    <div className="text-center text-white">
                      <div className="fs-4 fw-bold">85%</div>
                      <div className="small opacity-90">Attendance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="col-6 col-lg-3 mb-3">
              <div 
                className="card border-0 shadow-sm h-100"
                style={{
                  background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
                  borderRadius: "15px"
                }}
              >
                <div className="card-body p-3 text-center">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: stat.bgColor
                    }}
                  >
                    <IconComponent size={24} style={{ color: stat.color }} />
                  </div>
                  <div className="fs-3 fw-bold text-dark mb-1">{stat.value}</div>
                  <div className="text-muted small">{stat.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        {/* Quick Actions & Tasks */}
        <div className="col-lg-8">
          {/* Quick Actions */}
          <div 
            className="card border-0 shadow-sm mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title text-primary mb-4 d-flex align-items-center">
                <Zap size={20} className="me-2" />
                Quick Actions
              </h5>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #3fe2cd, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "80px"
                    }}
                  >
                    <Clock size={20} className="mb-2" />
                    <div className="small fw-bold">Check In</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #17a2b8, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "80px"
                    }}
                  >
                    <Calendar size={20} className="mb-2" />
                    <div className="small fw-bold">My Schedule</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "80px"
                    }}
                  >
                    <Target size={20} className="mb-2" />
                    <div className="small fw-bold">My Goals</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #28a745, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "80px"
                    }}
                  >
                    <Award size={20} className="mb-2" />
                    <div className="small fw-bold">Achievements</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title text-primary mb-4 d-flex align-items-center">
                <Target size={20} className="me-2" />
                Upcoming Tasks
              </h5>
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="d-flex align-items-center p-3 rounded" style={{ background: "#f8f9fa" }}>
                    <div className="form-check me-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={task.completed}
                        style={{ borderColor: "#3fe2cd" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className={`fw-semibold ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                        {task.title}
                      </div>
                      <div className="text-muted small">{task.dueDate}</div>
                    </div>
                    <span 
                      className={`badge rounded-pill px-3 py-1 ${
                        task.priority === 'high' ? 'bg-danger' :
                        task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Performance */}
        <div className="col-lg-4">
          {/* Recent Activities */}
          <div 
            className="card border-0 shadow-sm mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title text-primary mb-4 d-flex align-items-center">
                <Activity size={20} className="me-2" />
                Recent Activities
              </h5>
              <div className="timeline">
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="d-flex mb-3">
                      <div 
                        className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "35px",
                          height: "35px",
                          backgroundColor: activity.type === 'success' ? 'rgba(40, 167, 69, 0.1)' :
                                          activity.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' :
                                          'rgba(23, 162, 184, 0.1)'
                        }}
                      >
                        <IconComponent 
                          size={16} 
                          style={{ 
                            color: activity.type === 'success' ? '#28a745' :
                                   activity.type === 'warning' ? '#ffc107' :
                                   '#17a2b8'
                          }} 
                        />
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <div className="fw-semibold text-dark small">{activity.title}</div>
                        <div className="text-muted small">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title text-primary mb-4 d-flex align-items-center">
                <BarChart3 size={20} className="me-2" />
                This Month's Performance
              </h5>
              <div className="text-center">
                <div className="position-relative d-inline-block">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "conic-gradient(#3fe2cd 0deg 288deg, #e9ecef 288deg 360deg)"
                    }}
                  >
                    <div 
                      className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                      style={{ width: "90px", height: "90px" }}
                    >
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-primary">80%</div>
                        <div className="small text-muted">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">Tasks Completed</span>
                    <span className="fw-semibold">24/30</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">Hours Worked</span>
                    <span className="fw-semibold">168h</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Rating</span>
                    <div className="d-flex">
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star}
                          size={14} 
                          className={star <= 4 ? "text-warning" : "text-muted"}
                          fill={star <= 4 ? "#ffc107" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;