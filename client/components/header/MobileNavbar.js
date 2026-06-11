'use client';

import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faChevronRight,
  faListCheck,
  faRightFromBracket,
  faRightToBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const MobileNavbar = ({
  currentUser,
  numItems,
  showNotification,
  productCategories
}) => {
  return (
    <header>
      <Navbar variant="light" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <Navbar.Brand
                  as={Link}
                  href="/"
                  className="header-logo text-uppercase"
                >
                  Aurapan
                </Navbar.Brand>
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column justify-content-between ">
              <Nav className="offcanvas-body-upper d-flex flex-column justify-content-start">
                <Nav.Link
                  as={Link}
                  href="/products/bestseller"
                  className="offcanvas-link"
                >
                  Bestseller <FontAwesomeIcon icon={faChevronRight} />
                </Nav.Link>

                {productCategories.map((category, index) => (
                  <Nav.Link
                    as={Link}
                    href={`/products/${category.toLowerCase()}${
                      category === 'Dress' ? 'es' : 's'
                    }`}
                    key={index}
                    className="offcanvas-link"
                  >
                    {category} <FontAwesomeIcon icon={faChevronRight} />
                  </Nav.Link>
                ))}
              </Nav>

              {currentUser
                ? (
                  <Nav className="offcanvas-body-lower mb-2 d-flex flex-row justify-content-around">
                    <Nav.Link as={Link} href="/dashboard">
                      <FontAwesomeIcon icon={faUser} /> Account
                    </Nav.Link>
                    {currentUser?.isAdmin && (
                      <Nav.Link as={Link} href="/admin">
                        <FontAwesomeIcon icon={faListCheck} /> Management
                      </Nav.Link>
                    )}
                    <Nav.Link as={Link} href="/signout">
                      <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
                    </Nav.Link>
                  </Nav>
                  )
                : (
                  <Nav className="mx-3 d-flex flex-row justify-content-end ">
                    <Nav.Link as={Link} href="/signin">
                      <FontAwesomeIcon icon={faRightToBracket} /> Sign In
                    </Nav.Link>
                  </Nav>
                  )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <Navbar.Brand as={Link} href="/" className="header-logo text-uppercase">
            Aurapan
          </Navbar.Brand>

          <Nav className="icon-menu d-flex flex-row">
            <Nav.Link as={Link} href="/cart" className="position-relative cart-icon">
              <FontAwesomeIcon icon={faBasketShopping} /> Cart
              <span
                id="notification"
                className="position-absolute  badge border border-light rounded-circle bg-danger"
                style={{ display: showNotification ? 'block' : 'none' }}
              >
                <span className="visually-hidden">unread messages</span>
                {numItems}
              </span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default MobileNavbar;
