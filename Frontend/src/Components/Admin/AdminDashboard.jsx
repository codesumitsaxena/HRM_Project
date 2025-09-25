import React, { useState } from 'react';
import { Users, Calendar, FileText, BarChart3, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';

// Bootstrap CSS loader
const BootstrapCSS = () => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  
  return null;
};

const AdminDashboard = () => {
  // Sample dashboard data
  const dashboardStats = {
    totalEmployees: 156,
    presentToday: 142,
    onLeave: 8,
    pendingRequests: 12,
    newJoinees: 5,
    completedProjects: 28
  };

  const recentActivities = [
    {
      id: 1,
      type: 'leave_request',
      employee: 'Rahul Sharma',
      action: 'submitted leave request for 3 days',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'attendance',
      employee: 'Priya Singh',
      action: 'marked late attendance',
      time: '3 hours ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'employee',
      employee: 'New Employee',
      action: 'Amit Kumar joined IT Department',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'project',
      employee: 'Team Lead',
      action: 'Project "Mobile App" completed',
      time: '2 days ago',
      status: 'success'
    }
  ];

  const departmentData = [
    { name: 'IT', employees: 45, present: 42, percentage: 93 },
    { name: 'HR', employees: 12, present: 11, percentage: 92 },
    { name: 'Finance', employees: 18, present: 17, percentage: 94 },
    { name: 'Marketing', employees: 25, present: 23, percentage: 92 },
    { name: 'Operations', employees: 32, present: 30, percentage: 94 },
    { name: 'Sales', employees: 24, present: 19, percentage: 79 }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: '2024-09-25', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Performance Review', date: '2024-09-26', time: '2:00 PM', type: 'review' },
    { id: 3, title: 'Training Session', date: '2024-09-27', time: '11:00 AM', type: 'training' },
    { id: 4, title: 'Company Event', date: '2024-09-30', time: '6:00 PM', type: 'event' }
  ];

  return (
    <div>
      <BootstrapCSS />
      
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Admin Dashboard</h1>
          <p className="text-muted mb-0">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <FileText size={16} className="me-1" />
            Generate Report
          </button>
          <button className="btn btn-primary btn-sm">
            <Users size={16} className="me-1" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-primary mb-1">{dashboardStats.totalEmployees}</h3>
              <p className="text-muted small mb-0">Total Employees</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-success mb-1">{dashboardStats.presentToday}</h3>
              <p className="text-muted small mb-0">Present Today</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <Calendar className="text-warning" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-warning mb-1">{dashboardStats.onLeave}</h3>
              <p className="text-muted small mb-0">On Leave</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <AlertCircle className="text-danger" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-danger mb-1">{dashboardStats.pendingRequests}</h3>
              <p className="text-muted small mb-0">Pending Requests</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <TrendingUp className="text-info" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-info mb-1">{dashboardStats.newJoinees}</h3>
              <p className="text-muted small mb-0">New Joinees</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <BarChart3 className="text-success" size={24} />
                </div>
              </div>
              <h3 className="fw-bold text-success mb-1">{dashboardStats.completedProjects}</h3>
              <p className="text-muted small mb-0">Completed Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Recent Activities</h5>
                <button className="btn btn-sm btn-outline-primary">View All</button>
              </div>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="d-flex align-items-start mb-3">
                    <div className="flex-shrink-0 me-3">
                      <div className={`rounded-circle p-2 ${
                        activity.status === 'pending' ? 'bg-warning bg-opacity-10' :
                        activity.status === 'success' ? 'bg-success bg-opacity-10' :
                        'bg-info bg-opacity-10'
                      }`}>
                        {activity.type === 'leave_request' && <FileText size={16} className="text-warning" />}
                        {activity.type === 'attendance' && <Clock size={16} className="text-info" />}
                        {activity.type === 'employee' && <Users size={16} className="text-success" />}
                        {activity.type === 'project' && <BarChart3 size={16} className="text-success" />}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="mb-1">
                            <strong className="text-dark">{activity.employee}</strong> {activity.action}
                          </p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                        <span className={`badge ${
                          activity.status === 'pending' ? 'bg-warning' :
                          activity.status === 'success' ? 'bg-success' :
                          'bg-info'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats & Upcoming Events */}
        <div className="col-lg-4">
          {/* Department Attendance */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0 fw-bold">Department Attendance</h5>
            </div>
            <div className="card-body">
              {departmentData.map((dept, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium text-dark">{dept.name}</span>
                    <span className="text-muted small">{dept.present}/{dept.employees}</span>
                  </div>
                  <div className="progress" style={{height: '6px'}}>
                    <div 
                      className={`progress-bar ${dept.percentage >= 90 ? 'bg-success' : dept.percentage >= 80 ? 'bg-warning' : 'bg-danger'}`}
                      style={{width: `${dept.percentage}%`}}
                    ></div>
                  </div>
                  <small className="text-muted">{dept.percentage}% present</small>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0 fw-bold">Upcoming Events</h5>
            </div>
            <div className="card-body">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="flex-shrink-0 me-3">
                    <div className={`rounded p-2 ${
                      event.type === 'meeting' ? 'bg-primary bg-opacity-10' :
                      event.type === 'review' ? 'bg-warning bg-opacity-10' :
                      event.type === 'training' ? 'bg-info bg-opacity-10' :
                      'bg-success bg-opacity-10'
                    }`}>
                      <Calendar size={16} className={
                        event.type === 'meeting' ? 'text-primary' :
                        event.type === 'review' ? 'text-warning' :
                        event.type === 'training' ? 'text-info' :
                        'text-success'
                      } />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-medium">{event.title}</h6>
                    <p className="mb-0 text-muted small">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Quick Actions</h5>
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-2">
                  <button className="btn btn-outline-primary w-100">
                    <Users size={18} className="me-2" />
                    Manage Employees
                  </button>
                </div>
                <div className="col-md-3 col-sm-6 mb-2">
                  <button className="btn btn-outline-success w-100">
                    <Calendar size={18} className="me-2" />
                    View Attendance
                  </button>
                </div>
                <div className="col-md-3 col-sm-6 mb-2">
                  <button className="btn btn-outline-warning w-100">
                    <FileText size={18} className="me-2" />
                    Leave Requests
                  </button>
                </div>
                <div className="col-md-3 col-sm-6 mb-2">
                  <button className="btn btn-outline-info w-100">
                    <BarChart3 size={18} className="me-2" />
                    Generate Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;