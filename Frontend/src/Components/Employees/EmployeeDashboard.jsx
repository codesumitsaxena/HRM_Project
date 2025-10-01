import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, DollarSign, Award,
  CheckCircle, AlertCircle, Briefcase, Star, Coffee, Zap, 
  XCircle, ChevronLeft, ChevronRight, BarChart3, Activity
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const user = { userId: 1, name: 'John Doe' };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchAllData();
    return () => clearInterval(timer);
  }, [currentMonth]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const mockEmployeeData = {
        First_Name: 'John',
        Last_Name: 'Doe',
        Designation: 'Software Engineer',
        Department_Name: 'Engineering',
        Image_Path: 'https://via.placeholder.com/80'
      };
      setEmployeeData(mockEmployeeData);

      const mockAttendance = generateMockAttendance(currentMonth);
      setAttendanceData(mockAttendance);

      const stats = calculateStats(mockAttendance);
      setAttendanceStats(stats);

      const mockRecentLeaves = [
        { 
          id: 1, 
          type: 'Casual Leave', 
          startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15), 
          endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 17), 
          status: 'Approved' 
        },
        { 
          id: 2, 
          type: 'Sick Leave', 
          startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 22), 
          endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 23), 
          status: 'Pending' 
        }
      ];
      setRecentLeaves(mockRecentLeaves);

      const currentMonthLeaves = mockRecentLeaves.filter(leave => {
        const leaveMonth = leave.startDate.getMonth();
        return leaveMonth === currentMonth.getMonth();
      });

      const leavesThisMonth = currentMonthLeaves.reduce((total, leave) => {
        const days = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);

      const pendingThisMonth = currentMonthLeaves.filter(l => l.status === 'Pending').length;

      const mockLeaveData = {
        totalLeaves: 20,
        leavesTaken: leavesThisMonth,
        leavesAbsent: stats.totalAbsent,
        pendingApproval: pendingThisMonth,
        lossOfPay: 0
      };
      setLeaveData(mockLeaveData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (month) => {
    const attendance = [];
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    
    const festivals = {
      2: 'Gandhi Jayanti',
      12: 'Dussehra',
      20: 'Diwali',
      21: 'Diwali',
      22: 'Diwali'
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dayOfWeek = date.getDay();
      
      let status = null;
      
      if (year === today.getFullYear() && monthIndex === today.getMonth() && day > today.getDate()) {
        status = null;
      } else if (festivals[day]) {
        status = 'Holiday';
      } else if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Holiday';
      } else if (Math.random() > 0.95) {
        status = 'Absent';
      } else if (Math.random() > 0.9) {
        status = 'Leave';
      } else {
        status = 'Present';
      }

      attendance.push({
        date: date.toISOString().split('T')[0],
        status: status,
        festivalName: festivals[day] || null
      });
    }
    return attendance;
  };

  const calculateStats = (attendance) => {
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const leave = attendance.filter(a => a.status === 'Leave').length;
    const workingDays = attendance.filter(a => a.status && a.status !== 'Holiday').length;

    return {
      totalPresent: present,
      totalAbsent: absent,
      totalLeaves: leave,
      totalWorkingDays: workingDays
    };
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

  const getAttendanceForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceData.find(a => a.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return '#28a745';
      case 'Absent': return '#dc3545';
      case 'Leave': return '#ffc107';
      case 'Holiday': return '#6c757d';
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
      days.push(
        <div key={`empty-${i}`} className="col text-center p-1">
          <div style={{ height: '32px' }}></div>
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const record = getAttendanceForDate(date);
      const status = record?.status;
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} className="col text-center p-1">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${isToday ? 'border border-2 border-primary' : ''}`}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: status ? getStatusColor(status) : '#f8f9fa',
              color: status ? 'white' : '#6c757d',
              fontSize: '0.7rem',
              fontWeight: isToday ? 'bold' : 'normal',
              cursor: record?.festivalName ? 'pointer' : 'default'
            }}
            title={record?.festivalName || status || ''}
          >
            {day}
          </div>
          {record?.festivalName && (
            <div style={{ 
              fontSize: '0.45rem', 
              color: '#6c757d',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '32px',
              margin: '0 auto'
            }}>
              {record.festivalName.substring(0, 6)}
            </div>
          )}
        </div>
      );

      if ((startingDayOfWeek + day) % 7 === 0) {
        weeks.push(<div key={`week-${weeks.length}`} className="row g-1 mb-1">{days}</div>);
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(
          <div key={`empty-end-${days.length}`} className="col text-center p-1">
            <div style={{ height: '32px' }}></div>
          </div>
        );
      }
      weeks.push(<div key={`week-${weeks.length}`} className="row g-1 mb-1">{days}</div>);
    }

    return weeks;
  };

  const totalLeaves = leaveData?.totalLeaves || 20;
  const leavesTaken = leaveData?.leavesTaken || 0;
  const leavesAbsent = leaveData?.leavesAbsent || 0;
  const pendingApproval = leaveData?.pendingApproval || 0;
  const workingDays = attendanceStats?.totalWorkingDays || 0;
  const lossOfPay = leaveData?.lossOfPay || 0;

  const totalPresent = attendanceStats?.totalPresent || 0;
  const totalAbsent = attendanceStats?.totalAbsent || 0;
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
      title: "Leaves This Month",
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
      title: "Pending",
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

  const getRecentActivities = () => {
    const activities = [];
    
    const todayRecord = getAttendanceForDate(new Date());
    if (todayRecord?.status === 'Present') {
      activities.push({
        id: 'att-today',
        title: "Attendance Marked",
        time: "Today",
        type: "success",
        icon: CheckCircle
      });
    }

    const currentMonthLeaves = recentLeaves.filter(leave => 
      leave.startDate.getMonth() === currentMonth.getMonth()
    );

    currentMonthLeaves.forEach((leave, index) => {
      const days = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
      activities.push({
        id: `leave-${index}`,
        title: `${leave.type} ${leave.status}`,
        time: `${leave.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${leave.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${days} days)`,
        type: leave.status === 'Approved' ? 'success' : 'warning',
        icon: leave.status === 'Approved' ? CheckCircle : Clock
      });
    });

    const upcomingHolidays = attendanceData.filter(a => 
      a.status === 'Holiday' && 
      a.festivalName && 
      new Date(a.date) > new Date()
    ).slice(0, 2);

    upcomingHolidays.forEach((holiday, index) => {
      activities.push({
        id: `holiday-${index}`,
        title: holiday.festivalName,
        time: new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: "info",
        icon: Star
      });
    });

    return activities.slice(0, 5);
  };

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
                      <div className="d-flex align-items-center justify-content-center justify-content-md-start flex-wrap">
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
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{stat.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-2 g-md-3">
        <div className="col-lg-8">
          <div 
            className="card border-0 shadow-sm mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff90, #3fe2cd15)",
              borderRadius: "15px"
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
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

              <div className="row g-0 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="col text-center">
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

        <div className="col-lg-4">
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
                {getRecentActivities().map(activity => {
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