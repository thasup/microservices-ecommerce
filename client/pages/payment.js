import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Router from "next/router";

import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

const PaymentPage = ({ currentUser }) => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [onSubmit, setOnSubmit] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      Router.push("/signin");
    }

    const shippingAddress = localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : [];

    if (!shippingAddress.address) {
      Router.push("/shipping");
    }

    const data = localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : [];
    console.log("initial storage paymentMethod:", data);

    if (data !== undefined) {
      // Set state to paymentMethod data in localStorage
      setPaymentMethod(data);
    }

    if (onSubmit) {
      localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));

      setOnSubmit(false);
      Router.push("/checkout");
    }
  }, [onSubmit]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOnSubmit(true);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label className="mb-3" as="legend">
            Select Method
          </Form.Label>
          <Col>
            <Form.Check
              className="my-3"
              type="radio"
              label="Stripe or Credit Card"
              id="stripe"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              className="my-3"
              type="radio"
              label="Paypal or Credit Card"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="dark">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
