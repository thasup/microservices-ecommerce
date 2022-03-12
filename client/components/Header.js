import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import buildClient from "../api/build-client";

const Header = ({ currentUser, orders }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orders === undefined) {
      setOrder(null);
    } else {
      const unPaidOrders = orders?.filter((order) => order.isPaid === false);

      const recentOrder = unPaidOrders[`${unPaidOrders?.length - 1}`];

      setOrder(recentOrder);
    }

    // doRequest();
  }, [currentUser]);

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 40}`;
  };

  return (
    <header>
      <Navbar
        variant="light"
        expand="lg"
        // fixed="top"
        collapseOnSelect="true"
      >
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand className="header-logo text-uppercase">
              Aurapan
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
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
                <NavDropdown title={currentUser.email} id="username">
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
          </Navbar.Collapse>
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

export default Header;
