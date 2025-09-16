import { useState } from 'react';
import Sidebar from './Sidebar';
import NavbarTop from './NavbarApp';
import React from 'react';


const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <> <NavbarTop />
      <Sidebar show={showSidebar} handleClose={closeSidebar} />

      {/* <Container className="mt-4">
        <Row>
          <Col md={6} lg={3}>
            <DashboardCard title="Employees" count="120" variant="primary" />
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default Dashboard;