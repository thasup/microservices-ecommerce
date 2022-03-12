import React, { useState } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";
import styles from "../styles/signup.module.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const submitHandler = async (event) => {
    event.preventDefault();

    const response = await doRequest();
    console.log(response);
  };

  return (
    <Row>
      <Col sm={8}>
        <FormContainer>
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

            {errors}
            <Button className="mt-3" type="submit" variant="dark">
              Sign Up
            </Button>
          </Form>
        </FormContainer>
      </Col>
      <Col sm={4}></Col>
    </Row>
  );
};

export default signup;
