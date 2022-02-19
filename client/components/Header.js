import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const Header = ({ currentUser }) => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Aurapan</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link>
                <i className="fas fa-shopping-cart"></i> Cart
              </Nav.Link>
              {currentUser ? (
                <NavDropdown title={currentUser.email} id="username">
                  <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="#">Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link href="/signup">
                    <i className="fas fa-user"></i> Sign Up
                  </Nav.Link>
                  <Nav.Link href="/signin">
                    <i className="fas fa-key"></i> Sign In
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
