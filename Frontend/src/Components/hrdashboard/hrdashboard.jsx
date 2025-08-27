import React from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import SalaryChart from "./salarychart";
import EmployeeDashboard from "./employeDashboard";
// import EmployeeDashboard from "./employeDashboard";

const HRDashboard = () => {
  // Pie data
  const pieData = [
    { name: "Design", value: 84.6, color: "#2C5F7A" },
    { name: "Dev", value: 15.4, color: "#4ECDC4" },
    { name: "SEO", value: 5.1, color: "#F7DC6F" },
  ];

  // Bar data
  const barData = [
    { quarter: "Q1", Developer: 45, Marketing: 15, Sales: 5 },
    { quarter: "Q2", Developer: 35, Marketing: 75, Sales: 50 },
    { quarter: "Q3", Developer: 40, Marketing: 95, Sales: 25 },
    { quarter: "Q4", Developer: 25, Marketing: 35, Sales: 25 },
    { quarter: "Q5", Developer: 65, Marketing: 25, Sales: 10 },
    { quarter: "Q6", Developer: 35, Marketing: 15, Sales: 45 },
  ];

  const colors = {
    Developer: "#2C5F7A",
    Marketing: "#4ECDC4",
    Sales: "#F7DC6F",
  };

  // Bootstrap card for stats
  const StatCard = ({ icon, title, value, subtitle }) => (
    <div className="col-md-3 mb-3">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex align-items-center">
          <div className="fs-2 text-muted me-3">{icon}</div>
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h4 className="fw-bold mb-0">{value}</h4>
            {subtitle && <small className="text-success">{subtitle}</small>}
          </div>
        </div>
      </div>
    </div>
  );

  const Button = ({ children, active = false }) => (
    <button
      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"} me-1`}
    >
      {children}
    </button>
  );



  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">

          <div className="col-lg-4">
            {/* New Employee */}

            <div className="card shadow-sm mb-2">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 display-6">👤</div>
                <div>
                  <h5 className="card-title mb-1">New Employee</h5>
                  <h3 className="fw-bold mb-1">22</h3>
                  <p className="text-success small mb-0">8% Higher than last month</p>
                </div>
              </div>

            </div>

            {/* Total Employee */}

            <div className="card shadow-sm  mb-2">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 display-6">👥</div>
                <div>
                  <h5 className="card-title mb-1">Total Employee</h5>
                  <h3 className="fw-bold mb-1">425</h3>
                </div>
              </div>

            </div>

            {/* Total Salary */}

            <div className="card shadow-sm  mb-2">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 display-6">🏛️</div>
                <div>
                  <h5 className="card-title mb-1">Total Salary</h5>
                  <h3 className="fw-bold mb-1">$2.8M</h3>
                </div>
              </div>

            </div>

            {/* Avg. Salary */}

            <div className="card shadow-sm  mb-2">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 display-6">🏛️</div>
                <div>
                  <h5 className="card-title mb-1">Avg. Salary</h5>
                  <h3 className="fw-bold mb-1">$1,250</h3>
                </div>
              </div>
            </div>

          </div>


        {/* Pie Chart Card */}
        <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Income Analysis</h5>
                  <div>
                    <div className="d-none d-md-inline-block">
                      <Button>W</Button>
                    </div>
                    <div className="d-none d-sm-inline-block">
                      <Button>M</Button>
                    </div>
                    <Button active>Y</Button>
                    <Button>⋮</Button>
                  </div>
              </div>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="row text-center mt-3">
                {pieData.map((item, index) => (
                  <div key={index} className="col">
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted small">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Salary Statistics</h5>
                  <div>
                    <div className="d-none d-sm-inline-block">
                      <Button>W</Button>
                    </div>
                    <div className="d-none d-md-inline-block">
                      <Button>M</Button>
                    </div>
                    <Button active>Y</Button>
                    <Button>⋮</Button>
                </div>
              </div>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Developer" stackId="a" fill={colors.Developer} />
                    <Bar dataKey="Marketing" stackId="a" fill={colors.Marketing} />
                    <Bar dataKey="Sales" stackId="a" fill={colors.Sales} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SalaryChart />
     <EmployeeDashboard/>
      
    </div>
    </div >
  );
};

export default HRDashboard;
