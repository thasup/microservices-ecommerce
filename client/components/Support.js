import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import Message from "./Message";

const Support = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    // Dummy
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        setText("Thank you for submit comment!");
        setShowMessage(true);
      }, 1000);
    }
  }, [loading]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // axios
    //   .post("/contact", {
    //     name,
    //     email,
    //     subject,
    //     message,
    //   })
    //   .then(function (response) {
    //     setLoading(false);
    //     setText("Thank you for submit comment!");
    //     setShowMessage(true);
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     setLoading(false);
    //     setText(error);
    //     setShowMessage(true);
    //     console.log(error);
    //   });
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        {showMessage && <Message variant="success">{text}</Message>}

        <Col>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Your Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="subject" className="my-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="message" className="my-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              placeholder="Write your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="dark">
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
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Support;
