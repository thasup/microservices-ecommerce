import React, { useState } from "react";
import Router from "next/router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Head from "next/head";
import Image from "next/image";

import useRequest from "../hooks/use-request";
import Loader from "../components/Loader";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(undefined);

  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
      name,
      gender,
      age,
    },
    onSuccess: () => {
      Router.push("/");
      setLoading(false);
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    doRequest();
  };

  const myLoader = ({ src }) => {
    return `./asset/${src}`;
  };

  return (
    <>
      <Head>
        <title>Sign Up | Aurapan</title>
      </Head>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center px-0"
          style={{ marginTop: "80px" }}
        >
          <Loader />
        </div>
      ) : (
        <Container className="app-container register-box">
          <Row>
            <Col className="banner-img">
              <Image
                loader={myLoader}
                src="sign_up_banner.png"
                layout="fill"
                objectFit="cover"
                priority="true"
                alt="sign up banner"
              />
            </Col>

            <Col>
              <h1>Sign Up</h1>
              <Form className="mt-3" onSubmit={submitHandler}>
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

                {errors}
                <Button className="mt-3" type="submit" variant="dark">
                  Sign Up
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default signup;
