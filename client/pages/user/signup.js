import React, { useState } from "react";
import axios from "axios";

import styles from "../../styles/signup.module.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });

      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <Row>
      <Col sm={8}>
        <FormContainer>
          <h1>Sign Up</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
              ></Form.Control>
            </Form.Group>

            {errors}
            <Button type="submit" variant="primary">
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
