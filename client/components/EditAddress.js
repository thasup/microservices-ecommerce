import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../hooks/use-request";
import Message from "./Message";

const EditAddress = ({ user }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [message, setMessage] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${user.id}`,
    method: "patch",
    body: {
      address,
      city,
      postalCode,
      country,
    },
    onSuccess: (user) => {
      console.log(user);
      setUpdateSuccess(true);
      Router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (user || updateSuccess) {
      setAddress(user.address);
      setCity(user.city);
      setPostalCode(user.postalCode);
      setCountry(user.country);
    }

    if (errors) {
      setLoadingUpdate(false);
      setShowErrors(true);
    }

    setTimeout(() => {
      setUpdateSuccess(false);
      setLoadingUpdate(false);
    }, 3000);
  }, [user, updateSuccess, errors]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowErrors(false);
    setLoadingUpdate(true);

    doRequest();
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        {message && <Message variant="danger">{message}</Message>}
        {showErrors ? errors : null}
        {updateSuccess && <Message variant="success">Address Updated</Message>}

        <Col>
          <Form.Group controlId="address" className="mb-3">
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

          <Button type="submit" variant="dark">
            {loadingUpdate ? (
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
        </Col>
      </Row>
    </Form>
  );
};

export default EditAddress;
