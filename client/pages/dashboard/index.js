import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import Link from "next/link";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import useRequest from "../../hooks/use-request";
import ExpireTimer from "../../components/ExpireTimer";
import buildClient from "../../api/build-client";
import CustomTooltip from "../../components/CustomTooltip";

const Dashboard = ({ currentUser, orders }) => {
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
  }, [currentUser, loading, orders]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      updateProfile();
    }
  };

  return (
    <div className="app-container">
      <Row>
        <Col md={3}>
          <h1>User Profile</h1>
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
          <h1>My Order</h1>
          {loading ? (
            <Loader />
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>METHOD</th>
                  <th>EXPIRE</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>
                      <CustomTooltip index={index} mongoId={order.id} />{" "}
                    </td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>$ {order.totalPrice}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      {order.status === "cancelled" ? (
                        <p style={{ color: "red", fontWeight: "bolder" }}>
                          Expired
                        </p>
                      ) : order.status === "completed" ? (
                        <p style={{ color: "green", fontWeight: "bolder" }}>
                          Completed
                        </p>
                      ) : (
                        <>
                          <ExpireTimer order={order} />
                        </>
                      )}
                    </td>
                    <td>
                      {order.isPaid ? (
                        <p>
                          <i
                            className="fas fa-check"
                            style={{ color: "green" }}
                          ></i>{" "}
                          {order.paidAt?.substring(0, 10)}
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
        </Col>
      </Row>
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  // Redirect to signin page if user do not authorized
  if (data.currentUser === null) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  } else {
    const { data: orderData } = await client
      .get("/api/orders/myorders")
      .catch((err) => {
        console.log(err.message);
      });

    return { props: { orders: orderData } };
  }
}

export default Dashboard;
