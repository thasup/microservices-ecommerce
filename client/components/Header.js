import React from "react";
import Link from "next/link";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const Header = ({ currentUser }) => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>Aurapan</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Link href="#" passHref>
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </Link>
              {currentUser ? (
                <NavDropdown title={currentUser.email} id="username">
                  <Link href="#" passHref>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </Link>
                  {currentUser.isAdmin && (
                    <>
                      <Link href="/admin/products" passHref>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/create" passHref>
                        <NavDropdown.Item>Create Product</NavDropdown.Item>
                      </Link>
                    </>
                  )}
                  <Link href="/signout" passHref>
                    <NavDropdown.Item>Logout</NavDropdown.Item>
                  </Link>
                </NavDropdown>
              ) : (
                <>
                  <Link href="/signup" passHref>
                    <Nav.Link>
                      <i className="fas fa-user"></i> Sign Up
                    </Nav.Link>
                  </Link>

                  <Link href="/signin" passHref>
                    <Nav.Link>
                      <i className="fas fa-key"></i> Sign In
                    </Nav.Link>
                  </Link>
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
