import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import buildClient from "../api/build-client";

const CustomHeader = ({ currentUser, orders }) => {
  const [order, setOrder] = useState(null);
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    if (orders === undefined) {
      setOrder(null);
    } else {
      const unPaidOrders = orders?.filter((order) => order.isPaid === false);

      const recentOrder = unPaidOrders[`${unPaidOrders?.length - 1}`];

      setOrder(recentOrder);
    }

    // Update window innerWidth every 0.1 second
    const interval = setInterval(() => {
      if (window.innerWidth <= 992) {
        setOnMobile(true);
      } else {
        setOnMobile(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentUser, onMobile]);

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 40}`;
  };

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
            placement="end"
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

            <Offcanvas.Body>
              <Nav className="d-flex flex-column justify-content-end flex-grow-1 pe-3">
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
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <Link href="/" passHref>
            <Navbar.Brand className="header-logo text-uppercase">
              Aurapan
            </Navbar.Brand>
          </Link>

          <Nav className="icon-menu">
            {order ? (
              <Link
                href="/orders/[orderId]"
                as={`/orders/${order.id}`}
                passHref
              >
                <Nav.Link className="position-relative">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="position-absolute  badge border border-light rounded-circle bg-danger p-1">
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </Nav.Link>
              </Link>
            ) : (
              <Link href="/cart" passHref>
                <Nav.Link className="position-relative">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="position-absolute  badge border border-light rounded-circle bg-danger p-1">
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </Nav.Link>
              </Link>
            )}

            {currentUser ? (
              <NavDropdown
                title={<i class="fa-solid fa-circle-user"></i>}
                id="username"
              >
                {currentUser?.image && (
                  <div className="profile-img">
                    <Image
                      loader={myLoader}
                      src={currentUser.image}
                      alt="profile image"
                      width={150}
                      height={150}
                      layout="responsive"
                    />
                  </div>
                )}
                <Link href="/dashboard" passHref>
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </Link>
                {currentUser?.isAdmin && (
                  <>
                    <Link href="/admin" passHref>
                      <NavDropdown.Item>Admin Dashboard</NavDropdown.Item>
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
        <Container className="menu-container d-flex flex-row">
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

          <Nav>
            {order ? (
              <Link
                href="/orders/[orderId]"
                as={`/orders/${order.id}`}
                passHref
              >
                <Nav.Link className="position-relative">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="position-absolute  badge border border-light rounded-circle bg-danger p-1">
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </Nav.Link>
              </Link>
            ) : (
              <Link href="/cart" passHref>
                <Nav.Link className="position-relative">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="position-absolute  badge border border-light rounded-circle bg-danger p-1">
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </Nav.Link>
              </Link>
            )}

            {currentUser ? (
              <NavDropdown
                title={<i class="fa-solid fa-circle-user"></i>}
                id="username"
              >
                {currentUser?.image && (
                  <div className="profile-img">
                    <Image
                      loader={myLoader}
                      src={currentUser.image}
                      alt="profile image"
                      width={150}
                      height={150}
                      layout="responsive"
                    />
                  </div>
                )}
                <Link href="/dashboard" passHref>
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </Link>
                {currentUser?.isAdmin && (
                  <>
                    <Link href="/admin" passHref>
                      <NavDropdown.Item>Admin Dashboard</NavDropdown.Item>
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
