import React, { useState } from "react";

const SalaryChart = () => {
  const [activeTab, setActiveTab] = useState("Y");

  const chartData = [
    { month: "Jan", Sales: 80, Marketing: 45, Design: 30, Support: 40, Development: 35 },
    { month: "Feb", Sales: 30, Marketing: 35, Design: 25, Support: 30, Development: 28 },
    { month: "Mar", Sales: 25, Marketing: 28, Design: 35, Support: 35, Development: 40 },
    { month: "Apr", Sales: 60, Marketing: 40, Design: 45, Support: 25, Development: 35 },
    { month: "May", Sales: 35, Marketing: 30, Design: 25, Support: 40, Development: 45 },
    { month: "Jun", Sales: 40, Marketing: 35, Design: 40, Support: 35, Development: 30 },
    { month: "Jul", Sales: 55, Marketing: 45, Design: 50, Support: 40, Development: 38 },
    { month: "Aug", Sales: 45, Marketing: 40, Design: 35, Support: 60, Development: 50 },
    { month: "Sep", Sales: 25, Marketing: 35, Design: 30, Support: 35, Development: 25 },
    { month: "Oct", Sales: 70, Marketing: 50, Design: 45, Support: 40, Development: 55 },
    { month: "Nov", Sales: 85, Marketing: 60, Design: 65, Support: 70, Development: 75 },
    { month: "Dec", Sales: 45, Marketing: 40, Design: 30, Support: 25, Development: 35 },
  ];

  const lineColors = {
    Sales: "#4ECDC4",
    Marketing: "#F7DC6F",
    Design: "#2C5F7A",
    Support: "#95A5A6",
    Development: "#E67E22",
  };

  const todoItems = [
    { id: 1, title: "New Employee intro", time: "3:00 P.M. ON JUN 2021", completed: true },
    { id: 2, title: "Send email to CEO", time: "4:30 P.M. ON JUN 2021", completed: true },
    {
      id: 3,
      title: "New Joing Employee Welcome kit",
      time: "",
      completed: true,
      people: [
        { name: "John Smith", role: "Designer" },
        { name: "Hossein Shams", role: "Developer" },
        { name: "Maryam Amiri", role: "SEO" },
        { name: "Mike Litorus", role: "iOS Developer" },
      ],
    },
    { id: 4, title: "Birthday Wish", time: "4:30 P.M. ON JUN 2021", completed: true },
  ];

  const Button = ({ children, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`btn btn-sm me-2 ${active ? "btn-primary" : "btn-outline-secondary"}`}
    >
      {children}
    </button>
  );

  const LineChart = ({ data, colors }) => {
    const chartWidth = 600;
    const chartHeight = 250;
    const padding = 40;
    const maxValue = 100;

    const getX = (index) => padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const getY = (value) =>
      chartHeight - padding - (value / maxValue) * (chartHeight - 2 * padding);

    const createPath = (key) =>
      data
        .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point[key])}`)
        .join(" ");

    return (
      <svg width={chartWidth} height={chartHeight} className="overflow-visible">
        {[0, 20, 40, 60, 80, 100].map((value) => (
          <g key={value}>
            <line
              x1={padding}
              y1={getY(value)}
              x2={chartWidth - padding}
              y2={getY(value)}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <text x={padding - 10} y={getY(value) + 4} fontSize="12" fill="#666" textAnchor="end">
              {value}
            </text>
          </g>
        ))}

        {data.map((point, index) => (
          <text
            key={index}
            x={getX(index)}
            y={chartHeight - 20}
            fontSize="12"
            fill="#666"
            textAnchor="middle"
          >
            {point.month}
          </text>
        ))}

        {Object.keys(colors).map((key) => (
          <path key={key} d={createPath(key)} fill="none" stroke={colors[key]} strokeWidth="2" />
        ))}
      </svg>
    );
  };

  return (
    <div className=" bg-light ">
      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">Total Salary by Unit</h5>
                <div>
                  <Button active={activeTab === "W"} onClick={() => setActiveTab("W")}>
                    W
                  </Button>
                  <Button active={activeTab === "M"} onClick={() => setActiveTab("M")}>
                    M
                  </Button>
                  <Button active={activeTab === "Y"} onClick={() => setActiveTab("Y")}>
                    Y
                  </Button>
                  <Button>⋮</Button>
                </div>
              </div>

              {/* Legend */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                {Object.entries(lineColors).map(([key, color]) => (
                  <div key={key} className="d-flex align-items-center">
                    <div style={{ width: "20px", height: "3px", backgroundColor: color }}></div>
                    <span className="ms-2 text-muted">{key}</span>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="d-flex justify-content-center">
                <LineChart data={chartData} colors={lineColors} />
              </div>
            </div>
          </div>
        </div>

        {/* Todo Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">ToDo List</h5>
              <ul className="list-group list-group-flush">
                {todoItems.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="d-flex align-items-start">
                      <div
                        className={`me-3 mt-1 rounded-circle border d-flex justify-content-center align-items-center`}
                        style={{
                          width: "24px",
                          height: "24px",
                          background: item.completed ? "#20c997" : "transparent",
                          color: "#fff",
                        }}
                      >
                        {item.completed && "✔"}
                      </div>
                      <div>
                        <h6 className={item.completed ? "text-muted text-decoration-line-through" : ""}>
                          {item.title}
                        </h6>
                        {item.time && (
                          <small className="text-muted d-block">SCHEDULED FOR {item.time}</small>
                        )}
                        {item.people && (
                          <div className="mt-2">
                            {item.people.map((person, i) => (
                              <div key={i} className="d-flex align-items-center mb-1">
                                <div
                                  className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                                  style={{ width: "24px", height: "24px" }}
                                >
                                  {person.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <span className="text-primary me-2">{person.name}</span>
                                <small className="text-muted">{person.role}</small>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryChart;
