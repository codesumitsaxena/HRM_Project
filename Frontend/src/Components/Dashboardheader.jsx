import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { FaArrowLeft, FaUser, FaGlobe, FaCommentDots } from "react-icons/fa";

const DashboardHeader = () => {
  return (
    <div className="py-3 bg-light border-bottom w-100">
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between">
          {/* Left Side */}
          <Col md={6}>
            <div className="d-flex align-items-center mb-1">
              <FaArrowLeft className="text-primary me-2" />
              <h5 className="mb-0 fw-bold">Dashboard</h5>
            </div>
            <Breadcrumb className="mt-1 mb-0">
              <Breadcrumb.Item href="#">Lucid</Breadcrumb.Item>
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </Col>

          {/* Right Side - Stats */}
          <Col md={6} className="d-flex gap-4 justify-content-md-end">
            <Stat icon={<FaUser />} number="1,784" label="Visitors" color="teal" />
            <Stat icon={<FaGlobe />} number="325" label="Visits" color="orange" />
            <Stat icon={<FaCommentDots />} number="13" label="Chats" color="navy" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Stat = ({ icon, number, label, color }) => (
  <div className="text-end">
    <div className="text-dark fw-semibold d-flex align-items-center justify-content-end">
      {icon}&nbsp;<span>{number}</span>
    </div>
    <div className="text-muted small">{label}</div>
    <div
      style={{
        width: 50,
        height: 30,
        background: `linear-gradient(to top, ${color}, transparent)`,
        borderRadius: 4,
        marginTop: 4,
      }}
    ></div>
  </div>
);

export default DashboardHeader;

