import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { FaArrowLeft, FaUser, FaGlobe, FaCommentDots } from "react-icons/fa";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const DashboardHeader = () => {
  return (
    <div className="dashbordheader py-3 border-bottom w-100">
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between">
          {/* Left Side */}
          <Col className="mt-3" md={6}>
            <div className="d-flex align-items-center">
              <FaArrowLeft className="text-primary me-2" />
              <h5 className="mb-0 fw-bold">Dashboard</h5>
            </div>
            <Breadcrumb className="mt-1 mb-0">
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </Col>

          {/* Right Side - Stats */}
          <Col md={6} className="d-flex gap-4 justify-content-md-end">
            <Stat icon={<FaUser />} number="1,784" label="Visitors"  />
            <Stat icon={<FaGlobe />} number="325" label="Visits"  />
            <Stat icon={<FaCommentDots />} number="13" label="Chats"  />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Stat = ({ icon, number, label, color }) => (
  <div className="text-end d-flex">
    <div className="pt-4">
      <div className="text-dark fw-semibold d-flex align-items-center justify-content-end">
      {icon}&nbsp;<span>{number}</span>
    </div>
    <div className="text-muted small">{label}</div>
    </div>
    <div className="ps-2">
      <Stack direction="row" sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={70}
          width={55}
        />
      </Box>
    </Stack>
    </div>
  </div>
);

export default DashboardHeader;

