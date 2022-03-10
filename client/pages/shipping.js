import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Router from "next/router";

import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingPage = ({ currentUser }) => {
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [country, setCountry] = useState(null);

  const [onSubmit, setOnSubmit] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : [];
    console.log("initial storage shippingAddress:", data);

    if (currentUser?.shippingAddress.address) {
      // Set state to shippingAddress data in profile information
      setAddress(currentUser?.shippingAddress.address);
      setCity(currentUser?.shippingAddress.city);
      setPostalCode(currentUser?.shippingAddress.postalCode);
      setCountry(currentUser?.shippingAddress.country);

      setStorageReady(true);
    } else if (data !== undefined) {
      // Set state to shippingAddress data in localStorage
      setAddress(data.address);
      setCity(data.city);
      setPostalCode(data.postalCode);
      setCountry(data.country);

      // Start render the page
      setStorageReady(true);
    }

    const shippingAddress = {
      address: address,
      city: city,
      postalCode: postalCode,
      country: country,
    };

    if (onSubmit) {
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      setOnSubmit(false);
      Router.push("/payment");
    }
  }, [onSubmit]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOnSubmit(true);
  };

  return storageReady ? (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="dark">
          Continue
        </Button>
      </Form>
    </FormContainer>
  ) : null;
};

export default ShippingPage;
