import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../../../hooks/use-request";
import Loader from "../../../components/Loader";
import buildClient from "../../../api/build-client";

const UserEdit = ({ users }) => {
  const { userId } = useRouter().query;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(undefined);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(undefined);
  const [bio, setBio] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);

  const user = users.find((user) => user.id === userId);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${userId}`,
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
      jsonShippingAddress: JSON.stringify({
        address: address,
        city: city,
        postalCode: postalCode,
        country: country,
      }),
    },
    onSuccess: (user) => {
      console.log(user);
      Router.push("/admin");
      setLoading(false);
    },
  });

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setIsAdmin(user.isAdmin);
      setName(user.name);
      setImage(user.image);
      setGender(user.gender);
      setAge(user.age);
      setBio(user.bio);

      if (user.shippingAddress) {
        setAddress(user.shippingAddress.address);
        setCity(user.shippingAddress.city);
        setPostalCode(user.shippingAddress.postalCode);
        setCountry(user.shippingAddress.country);
      }
    }
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    doRequest();
  };

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <Container className="app-container">
      <h1>Edit User Information</h1>
      <Row className="mt-3">
        <Col md={6}>
          <Form onSubmit={submitHandler}>
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

            <Form.Group controlId="isadmin" className="my-3">
              <Form.Label>Admin</Form.Label>
              <Form.Control
                as="select"
                className="form-select"
                value={isAdmin}
                onChange={(e) => setIsAdmin(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="true">TRUE</option>
                <option value="false">FALSE</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="gender" className="my-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="age" className="my-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="bio" className="my-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {errors}
            <Button className="mt-3" type="submit" variant="dark">
              {loading ? (
                <Spinner
                  animation="border"
                  role="status"
                  as="span"
                  size="sm"
                  aria-hidden="true"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : null}{" "}
              Update
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <Form.Group controlId="address" className="my-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city" className="my-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="postalCode" className="my-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="country" className="my-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  // Redirect to signin page or home if user do not authorized
  if (data.currentUser === null) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  } else if (data.currentUser.isAdmin === false) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const { data: userData } = await client.get("/api/users").catch((err) => {
      console.log(err.message);
    });

    return {
      props: { users: userData },
    };
  }
}

export default UserEdit;
