import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';
import logo from './logo.png';

function NavBar({ setActivePage }) {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand>
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActivePage('visualizations')}><h5>Visualizations</h5></Nav.Link>
            <Nav.Link onClick={() => setActivePage('takeaways')}><h5>Takeaways</h5></Nav.Link>
            <Nav.Link onClick={() => setActivePage('about')}><h5>About</h5></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;