import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import useRequest from "../../hooks/use-request";

const ProfilePage = ({ currentUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [fetchOrderSuccess, setFetchOrderSuccess] = useState(false);
  const [orders, setOrders] = useState(null);

  const { doRequest: fetchOrders, errors: fetchOrdersErrors } = useRequest({
    url: `/api/orders`,
    method: "get",
    body: {},
    onSuccess: (orders) => {
      console.log(orders);
      setOrders(orders);
      setFetchOrderSuccess(true);
    },
  });

  console.log("Has orders? :", orders);

  const { doRequest: updateProfile, errors: updateErrors } = useRequest({
    url: "/api/users/profile",
    method: "patch",
    body: {
      email,
      password,
      isAdmin,
      name,
      image,
      gender,
      age,
      bio,
      address,
      city,
      postalCode,
      country,
    },
    onSuccess: (user) => {
      console.log(user);
      setLoading(false);
      setUpdateSuccess(true);
    },
  });

  useEffect(() => {
    if (!currentUser) {
      Router.push("/signin");
    }

    if (currentUser.email) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setIsAdmin(currentUser.isAdmin);
      setImage(currentUser.image);
      setGender(currentUser.gender);
      setAge(currentUser.age);
      setBio(currentUser.bio);
      setAddress(currentUser.shippingAddress.address);
      setCity(currentUser.shippingAddress.city);
      setPostalCode(currentUser.shippingAddress.postalCode);
      setCountry(currentUser.shippingAddress.country);
    }

    if (!orders) {
      fetchOrders();
    }

    if (loading === true) {
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
    }
  }, [currentUser, loading]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      updateProfile();
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {updateErrors}
        {updateSuccess && (
          <Message variant="updateSuccess">Profile Updated</Message>
        )}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="dark" className="my-3">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Order</h2>
        {fetchOrderSuccess ? (
          <>
            {loading ? (
              <Loader />
            ) : fetchOrdersErrors ? (
              { fetchOrdersErrors }
            ) : (
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>$ {order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          <p>
                            <i
                              className="fas fa-check"
                              style={{ color: "green" }}
                            ></i>{" "}
                            {order.paidAt.substring(0, 10)}
                          </p>
                        ) : (
                          <p>
                            <i
                              className="fas fa-times"
                              style={{ color: "red" }}
                            ></i>{" "}
                            Not Paid
                          </p>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <p>
                            <i
                              className="fas fa-check"
                              style={{ color: "green" }}
                            ></i>{" "}
                            {order.deliveredAt.substring(0, 10)}
                          </p>
                        ) : (
                          <p>
                            <i
                              className="fas fa-times"
                              style={{ color: "red" }}
                            ></i>{" "}
                            Not Delivered
                          </p>
                        )}
                      </td>
                      <td>
                        <Link
                          href={"/orders/[orderId]"}
                          as={`/orders/${order.id}`}
                          passHref
                        >
                          <Button className="btn-sm" variant="light">
                            <i className="fas fa-info-circle"></i> Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        ) : null}
      </Col>
    </Row>
  );
};

export default ProfilePage;
