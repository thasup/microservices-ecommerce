import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import buildClient from "../api/build-client";
import useRequest from "../hooks/use-request";

const Header = ({ currentUser }) => {
  const [order, setOrder] = useState(null);

  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "get",
    body: {},
    onSuccess: (orders) => {
      console.log(orders);
      setOrder(orders[`${orders.length - 1}`]);
    },
  });

  console.log("Has orders? :", order);

  useEffect(() => {
    doRequest();
  }, [currentUser]);

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
              {order?.isPaid === false ? (
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
                  <Link href="/user/profile" passHref>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </Link>
                  {currentUser.isAdmin && (
                    <>
                      <Link href="/admin/product-list" passHref>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/create-product" passHref>
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

// export async function getStaticProps(context) {
//   const client = buildClient(context);
//   const { data } = await client.get("/api/orders");
//   console.log("server header:", data);
//   if (data.length !== 0) {
//     const recentOrder = data[`${data.length - 1}`];
//     console.log("server header:", recentOrder);

//     return recentOrder;
//   }

//   return { props: { order: recentOrder } };
// }

// Header.getInitialProps = async (context, client, ordersData) => {
//   const { data } = await client.get("/api/orders");

//   console.log("server header:", data);

//   return { order: data };
// };

export default Header;
