import { useRouter } from "@tanstack/react-router";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { QuestionCircle } from 'react-bootstrap-icons';
import { useAuth } from "../auth";

const NavBar = ({ isAuthenticated }: { isAuthenticated: boolean}) => {

  const router = useRouter();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout??')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          router.navigate({ to: '/' })
        })
      })
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Module Manager</Navbar.Brand>
        {isAuthenticated && (
          <Nav className="ms-md-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/help"><QuestionCircle size={24}/></Nav.Link>
          </Nav>
        )}
        {!isAuthenticated && (
          <Nav className="ms-md-auto">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
