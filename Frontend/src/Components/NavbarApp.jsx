
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Dropdown,
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
import LogoImg from '../assets/logoImg.png'; // or .svg, .jpg depending on your file type


const NavbarTop = () => {
  return (
    <Navbar bg="white" expand="lg" className="justify-content-between w-100 px-3 shadow-sm border-bottom">
      <Container  className="container d-flex align-items-center">
        {/* Logo */}
        <Navbar.Brand className="logoSearch  text-info me-3">
<img src={LogoImg} alt="Logo" className=" img-fluid" style={{height:"auto", width:"100px"}}  />
        </Navbar.Brand>

        {/* Search */}
        <Form className="searchTopnav d-flex flex-grow-1 me-3" >
          <FormControl
            type="search"
            placeholder="Search here..."
            className="me-2"
          />
          <Button variant="outline-secondary">
            <FaSearch />
          </Button>
        </Form>

        {/* Right Icons */}
        <Nav className="righticon  ms-auto align-items-center gap-4 justify-content-end">
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
      </Container>
    </Navbar>
  );
};

export default NavbarTop;

