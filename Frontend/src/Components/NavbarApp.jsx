import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import {
  FaSearch,
  FaCalendarAlt,
  FaComments,
  FaEnvelope,
  FaBell,
  FaSlidersH,
  FaSignOutAlt,
} from 'react-icons/fa';
import LogoImg from '../assets/LogoImgg.png';

const NavbarTop = () => {
  return (
    <Navbar
      expand="lg"
      className=" navbarTop w-100 px-3 py-3 shadow-sm border-bottom"
    >
      <Container  className="align-items-center">
        {/* Logo */}
        <Navbar.Brand className="logoSearch  text-info me-3">
          <img
            src={LogoImg}
            alt="Logo"
            className="img-fluid"
            style={{ height: 'auto', width: '100px' }}
          />
        </Navbar.Brand>

        {/* Search Bar */}
        <div className='d-flex w-50'>
          <Form className="searchTopnav d-flex me-3">
          <FormControl
            type="search"
            placeholder="Search here..."
            className="me-2"
          />
          <Button variant="outline-secondary">
            <FaSearch />
          </Button>
          </Form>
         </div>
          {/* Toggle Button */}
          <Navbar.Toggle aria-controls="navbar-icons" className="toggle-size ms-2" />

          {/* Collapsible Icons */}
          <Navbar.Collapse id="navbar-icons" >
            <Nav className="righticon align-items-end mt-2 gap-3 ms-auto">
              <FaCalendarAlt size={18} />
              <FaComments size={18} />
              <div className="position-relative">
                <FaEnvelope size={18} />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-light rounded-circle"></span>
              </div>
              <div className="position-relative">
                <FaBell size={18} />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-info border border-light rounded-circle"></span>
              </div>
              <FaSlidersH size={18} />
              <FaSignOutAlt size={18} />
            </Nav>
          </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
};

export default NavbarTop;

