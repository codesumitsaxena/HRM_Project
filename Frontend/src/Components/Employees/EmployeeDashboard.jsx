import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import {
  User, Calendar, Clock, DollarSign, Award, TrendingUp,
  Bell, CheckCircle, AlertCircle, BookOpen, Target, Users,
  BarChart3, Activity, Briefcase, Building2, Star, Coffee, Zap, 
  XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchAllData();
    return () => clearInterval(timer);
  }, []);

  const getEmployeeId = () => {
    if (user?.userId) return user.userId;
    if (user?.employeeId) return user.employeeId;
    if (user?.User_Id) return user.User_Id;
    
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.userId || parsedUser.employeeId || parsedUser.User_Id;
      }
    } catch (error) {
      console.error('Error parsing user:', error);
    }
    
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.employeeId || payload.userId || payload.User_Id || payload.id;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    return null;
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const employeeId = getEmployeeId();

      if (!employeeId) {
        console.error('No employee ID found');
        setLoading(false);
        return;
      }

      // Fetch employee profile
      try {
        const profileRes = await fetch(`http://localhost:3000/employees/${employeeId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setEmployeeData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }

      // Fetch attendance data
      try {
        const attendanceRes = await fetch(`http://localhost:3000/attendance/employee/${employeeId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (attendanceRes.ok) {
          const data = await attendanceRes.json();
          setAttendanceData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }

      // Fetch attendance statistics
      try {
        const statsRes = await fetch(`http://localhost:3000/attendance/stats/${employeeId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setAttendanceStats(data);
        }
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      }

      // Fetch leave data
      try {
        const leaveRes = await fetch(`http://localhost:3000/leaves/employee/${employeeId}/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (leaveRes.ok) {
          const data = await leaveRes.json();
          setLeaveData(data);
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(a => {
      const recordDate = new Date(a.date || a.Date || a.Attendance_Date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
    
    if (!record) return null;
    
    // Check different status field names
    const status = record.status || record.Status || record.Attendance_Status;
    
    // Normalize status values
    if (status === 'Present' || status === 'present' || status === 'P') return 'present';
    if (status === 'Absent' || status === 'absent' || status === 'A') return 'absent';
    if (status === 'Leave' || status === 'leave' || status === 'L') return 'leave';
    if (status === 'Holiday' || status === 'holiday' || status === 'H') return 'holiday';
    
    return status?.toLowerCase();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return '#28a745';
      case 'absent': return '#dc3545';
      case 'leave': return '#ffc107';
      case 'holiday': return '#6c757d';
      default: return 'transparent';
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const weeks = [];
    let days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-1"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getAttendanceStatus(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} className="text-center p-1" style={{ position: 'relative' }}>
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${isToday ? 'border border-2 border-primary' : ''}`}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: status ? getStatusColor(status) : '#f8f9fa',
              color: status ? 'white' : '#6c757d',
              fontSize: '0.75rem',
              fontWeight: isToday ? 'bold' : 'normal'
            }}
          >
            {day}
          </div>
        </div>
      );

      if ((startingDayOfWeek + day) % 7 === 0) {
        weeks.push(<div key={`week-${weeks.length}`} className="row g-1 mb-1">{days}</div>);
        days = [];
      }
    }

    if (days.length > 0) {
      weeks.push(<div key={`week-${weeks.length}`} className="row g-1 mb-1">{days}</div>);
    }

    return weeks;
  };

  // Calculate dynamic leave stats
  const totalLeaves = leaveData?.totalLeaves || leaveData?.total_leaves || 10;
  const leavesTaken = leaveData?.leavesTaken || leaveData?.leaves_taken || 0;
  const leavesAbsent = leaveData?.leavesAbsent || leaveData?.leaves_absent || 0;
  const pendingApproval = leaveData?.pendingApproval || leaveData?.pending_approval || 0;
  const workingDays = attendanceStats?.totalWorkingDays || attendanceStats?.total_working_days || 0;
  const lossOfPay = leaveData?.lossOfPay || leaveData?.loss_of_pay || 0;

  // Calculate attendance percentage
  const totalPresent = attendanceStats?.totalPresent || attendanceStats?.total_present || 0;
  const totalAbsent = attendanceStats?.totalAbsent || attendanceStats?.total_absent || 0;
  const attendancePercentage = workingDays > 0 
    ? Math.round((totalPresent / workingDays) * 100) 
    : 0;

  const leaveStats = [
    {
      title: "Total Leaves",
      value: totalLeaves,
      icon: Calendar,
      color: "#17a2b8",
      bgColor: "rgba(23, 162, 184, 0.1)"
    },
    {
      title: "Leaves Taken",
      value: leavesTaken,
      icon: CheckCircle,
      color: "#28a745",
      bgColor: "rgba(40, 167, 69, 0.1)"
    },
    {
      title: "Leaves Absent",
      value: leavesAbsent,
      icon: XCircle,
      color: "#dc3545",
      bgColor: "rgba(220, 53, 69, 0.1)"
    },
    {
      title: "Pending Approval",
      value: pendingApproval,
      icon: Clock,
      color: "#ffc107",
      bgColor: "rgba(255, 193, 7, 0.1)"
    },
    {
      title: "Working Days",
      value: workingDays,
      icon: Briefcase,
      color: "#6610f2",
      bgColor: "rgba(102, 16, 242, 0.1)"
    },
    {
      title: "Loss of Pay",
      value: lossOfPay,
      icon: DollarSign,
      color: "#fd7e14",
      bgColor: "rgba(253, 126, 20, 0.1)"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Attendance Marked",
      time: "Today",
      type: "success",
      icon: CheckCircle
    },
    {
      id: 2,
      title: "Leave Request Submitted",
      time: "2 days ago",
      type: "info",
      icon: Calendar
    },
    {
      id: 3,
      title: "Performance Review Due",
      time: "5 days",
      type: "warning",
      icon: AlertCircle
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" style={{ color: '#3fe2cd' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-2 p-md-4"
      style={{
        background: "linear-gradient(135deg, #3fe2cd08, #ffffff95, #3fe2cd12)",
        minHeight: "100vh"
      }}
    >
      {/* Header Section */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #3fe2cd, #2c5f5d)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center flex-column flex-md-row text-center text-md-start">
                    <div className="me-md-3 mb-2 mb-md-0">
                      <img
                        src={employeeData?.Image_Path || "https://via.placeholder.com/80"}
                        alt="Profile"
                        className="rounded-circle border border-white border-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="text-white">
                      <h4 className="mb-1 fw-bold">
                        Welcome back, {employeeData?.First_Name || user?.name || 'Employee'}!
                      </h4>
                      <p className="mb-2 opacity-90 small">
                        {employeeData?.Designation || 'Employee'} • {employeeData?.Department_Name || 'Department'}
                      </p>
                      <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                        <Coffee size={14} className="me-2" />
                        <span style={{ fontSize: '0.85rem' }}>
                          {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
                  <div className="text-white">
                    <div className="fs-5 fw-bold">{attendancePercentage}%</div>
                    <div style={{ fontSize: '0.75rem' }} className="opacity-90">Attendance Rate</div>
                    <div className="mt-2 small opacity-90">
                      {totalPresent} Present / {totalAbsent} Absent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Stats Cards */}
      <div className="row mb-3 mb-md-4 g-2 g-md-3">
        {leaveStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="col-6 col-lg-2">
              <div 
                className="card border-0 shadow-sm h-100"
                style={{
                  background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
                  borderRadius: "12px"
                }}
              >
                <div className="card-body p-2 p-md-3 text-center">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: stat.bgColor
                    }}
                  >
                    <IconComponent size={20} style={{ color: stat.color }} />
                  </div>
                  <div className="fs-4 fw-bold text-dark mb-1">{stat.value}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{stat.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-2 g-md-3">
        {/* Attendance Calendar */}
        <div className="col-lg-8">
          <div 
            className="card border-0 shadow-sm mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-primary mb-0 d-flex align-items-center">
                  <Calendar size={20} className="me-2" />
                  Attendance Calendar
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={previousMonth}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={nextMonth}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="row g-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="col text-center">
                    <small className="fw-bold text-muted">{day}</small>
                  </div>
                ))}
              </div>

              {renderCalendar()}

              <div className="row mt-3 g-2">
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle me-2" style={{ width: '16px', height: '16px', backgroundColor: '#28a745' }}></div>
                    <small>Present</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle me-2" style={{ width: '16px', height: '16px', backgroundColor: '#dc3545' }}></div>
                    <small>Absent</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle me-2" style={{ width: '16px', height: '16px', backgroundColor: '#ffc107' }}></div>
                    <small>Leave</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle me-2" style={{ width: '16px', height: '16px', backgroundColor: '#6c757d' }}></div>
                    <small>Holiday</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title text-primary mb-3 d-flex align-items-center">
                <Zap size={20} className="me-2" />
                Quick Actions
              </h5>
              <div className="row g-2">
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #3fe2cd, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "70px"
                    }}
                  >
                    <Clock size={18} className="mb-1" />
                    <div style={{ fontSize: '0.8rem' }} className="fw-bold">Check In</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #17a2b8, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "70px"
                    }}
                  >
                    <Calendar size={18} className="mb-1" />
                    <div style={{ fontSize: '0.8rem' }} className="fw-bold">Apply Leave</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #ffc107, #fd7e14)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "70px"
                    }}
                  >
                    <DollarSign size={18} className="mb-1" />
                    <div style={{ fontSize: '0.8rem' }} className="fw-bold">Payroll</div>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className="btn w-100 h-100 border-0"
                    style={{
                      background: "linear-gradient(45deg, #28a745, #20c997)",
                      color: "white",
                      borderRadius: "12px",
                      minHeight: "70px"
                    }}
                  >
                    <Award size={18} className="mb-1" />
                    <div style={{ fontSize: '0.8rem' }} className="fw-bold">Performance</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Recent Activities */}
          <div 
            className="card border-0 shadow-sm mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title text-primary mb-3 d-flex align-items-center">
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
                          width: "32px",
                          height: "32px",
                          backgroundColor: activity.type === 'success' ? 'rgba(40, 167, 69, 0.1)' :
                                          activity.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' :
                                          'rgba(23, 162, 184, 0.1)'
                        }}
                      >
                        <IconComponent 
                          size={14} 
                          style={{ 
                            color: activity.type === 'success' ? '#28a745' :
                                   activity.type === 'warning' ? '#ffc107' :
                                   '#17a2b8'
                          }} 
                        />
                      </div>
                      <div className="ms-2 flex-grow-1">
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{activity.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Attendance Ratio */}
          <div 
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title text-primary mb-3 d-flex align-items-center">
                <BarChart3 size={20} className="me-2" />
                Attendance Ratio
              </h5>
              <div className="text-center">
                <div className="position-relative d-inline-block mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "110px",
                      height: "110px",
                      background: `conic-gradient(#3fe2cd 0deg ${(attendancePercentage * 3.6)}deg, #e9ecef ${(attendancePercentage * 3.6)}deg 360deg)`
                    }}
                  >
                    <div 
                      className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                      style={{ width: "85px", height: "85px" }}
                    >
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-primary">{attendancePercentage}%</div>
                        <div style={{ fontSize: '0.7rem' }} className="text-muted">Present</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: '0.85rem' }} className="text-muted">Total Present</span>
                    <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{totalPresent}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: '0.85rem' }} className="text-muted">Total Absent</span>
                    <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{totalAbsent}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: '0.85rem' }} className="text-muted">Working Days</span>
                    <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{workingDays}</span>
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