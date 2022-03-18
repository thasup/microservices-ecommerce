import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import buildClient from "../api/build-client";

const CustomHeader = ({ currentUser, orders }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [numItems, setNumItems] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    // Update window innerWidth every 0.1 second
    const interval = setInterval(() => {
      // Initial retrieve data from localStorage
      const cartItems = localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];

      if (cartItems.length !== 0) {
        setShowNotification(true);
        setNumItems(cartItems.length);
      } else if (cartItems.length === 0 || !cartItems) {
        setShowNotification(false);
        setNumItems(0);
      }

      if (window.innerWidth <= 992) {
        setOnMobile(true);
      } else {
        setOnMobile(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentUser, onMobile]);

  // const myLoader = ({ src, width, quality }) => {
  //   return `${src}&w=${width}&q=${quality || 40}`;
  // };

  return onMobile ? (
    <header>
      <Navbar
        variant="light"
        expand="lg"
        fixed="top"
        collapseOnSelect="true"
        className="menu"
      >
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <Link href="/" passHref>
                  <Navbar.Brand className="header-logo text-uppercase">
                    Aurapan
                  </Navbar.Brand>
                </Link>
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column justify-content-between ">
              <Nav className="d-flex flex-column justify-content-start  pe-3">
                <Link href="/products/bestseller" passHref>
                  <Nav.Link>Bestseller</Nav.Link>
                </Link>

                <Link href="/products/tops" passHref>
                  <Nav.Link>Top</Nav.Link>
                </Link>

                <Link href="/products/bottoms" passHref>
                  <Nav.Link>Bottom</Nav.Link>
                </Link>

                <Link href="/products/dresses" passHref>
                  <Nav.Link>Dress</Nav.Link>
                </Link>

                <Link href="/products/sets" passHref>
                  <Nav.Link>Set</Nav.Link>
                </Link>

                <Link href="/products/coats" passHref>
                  <Nav.Link>Coat</Nav.Link>
                </Link>
              </Nav>

              {currentUser ? (
                <Nav className="d-flex flex-row justify-content-evenly ">
                  <Link href="/dashboard" passHref>
                    <Nav.Link>
                      <i className="fas fa-user"></i> Account
                    </Nav.Link>
                  </Link>
                  {currentUser?.isAdmin && (
                    <Link href="/admin" passHref>
                      <Nav.Link>
                        <i className="fas fa-list-check"></i> Management
                      </Nav.Link>
                    </Link>
                  )}
                  <Link href="/signout" passHref>
                    <Nav.Link>
                      <i className="fa-solid fa-right-from-bracket"></i> Sign
                      Out
                    </Nav.Link>
                  </Link>
                </Nav>
              ) : (
                <Nav className="mx-3 d-flex flex-row justify-content-end ">
                  <Link href="/signin" passHref>
                    <Nav.Link>
                      <i className="fa-solid fa-right-to-bracket"></i> Sign In
                    </Nav.Link>
                  </Link>
                </Nav>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <Link href="/" passHref>
            <Navbar.Brand className="header-logo text-uppercase">
              Aurapan
            </Navbar.Brand>
          </Link>

          <Nav className="icon-menu d-flex flex-row">
            <Link href="/cart" passHref>
              <Nav.Link className="position-relative cart-icon">
                <i className="fas fa-basket-shopping"></i>
                {showNotification && (
                  <span
                    id="notification"
                    className="position-absolute  badge border border-light rounded-circle bg-danger"
                  >
                    <span className="visually-hidden">unread messages</span>
                    {numItems}
                  </span>
                )}
              </Nav.Link>
            </Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  ) : (
    <header>
      <Navbar
        variant="light"
        expand="lg"
        fixed="top"
        collapseOnSelect="true"
        className="menu"
      >
        <Container
          className="menu-container d-flex flex-row"
          onMouseLeave={() => setShowDropDown(false)}
        >
          <Link href="/" passHref>
            <Navbar.Brand className="header-logo text-uppercase">
              Aurapan
            </Navbar.Brand>
          </Link>

          <Nav className="sub-menu">
            <Link href="/products/bestseller" passHref>
              <Nav.Link>Bestseller</Nav.Link>
            </Link>

            <Link href="/products/tops" passHref>
              <Nav.Link>Top</Nav.Link>
            </Link>

            <Link href="/products/bottoms" passHref>
              <Nav.Link>Bottom</Nav.Link>
            </Link>

            <Link href="/products/dresses" passHref>
              <Nav.Link>Dress</Nav.Link>
            </Link>

            <Link href="/products/sets" passHref>
              <Nav.Link>Set</Nav.Link>
            </Link>

            <Link href="/products/coats" passHref>
              <Nav.Link>Coat</Nav.Link>
            </Link>
          </Nav>

          <Nav className="icon-menu d-flex flex-row position-relative">
            <Link href="/cart" passHref>
              <Nav.Link className="position-relative cart-icon">
                <i className="fas fa-basket-shopping"></i>
                {showNotification && (
                  <span
                    id="notification"
                    className="position-absolute  badge border border-light rounded-circle bg-danger"
                  >
                    <span className="visually-hidden">unread messages</span>
                    {numItems}
                  </span>
                )}
              </Nav.Link>
            </Link>

            <Link href={currentUser ? "/dashboard" : "/signin"} passHref>
              <Nav.Link
                className="account-icon"
                onMouseEnter={() =>
                  currentUser ? setShowDropDown(true) : setShowDropDown(false)
                }
              >
                <i className="fa-regular fa-circle-user"></i>
              </Nav.Link>
            </Link>

            <div
              className="account-dropdown-menu"
              style={{ display: showDropDown ? "block" : "none" }}
              onMouseLeave={() => setShowDropDown(false)}
            >
              <Link href="/dashboard" passHref>
                <a className="account-dropdown-item">
                  <i className="fas fa-user"></i> Account
                </a>
              </Link>
              {currentUser?.isAdmin && (
                <Link href="/admin" passHref>
                  <a className="account-dropdown-item">
                    <i className="fas fa-list-check"></i> Management
                  </a>
                </Link>
              )}
              <Link href="/signout" passHref>
                <a className="account-dropdown-item">
                  <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                </a>
              </Link>
            </div>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data: orderData } = await client.get("/api/orders");

  return {
    props: { orders: orderData },
  };
}

export default CustomHeader;
