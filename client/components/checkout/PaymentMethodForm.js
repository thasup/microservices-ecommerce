'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

import CheckoutSteps from '../cart/CheckoutSteps';
import FormContainer from '../common/FormContainer';

const PaymentMethodForm = ({ currentUser }) => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [onSubmit, setOnSubmit] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Protect unauthorized access
    if (!currentUser) {
      router.push('/signin');
      return;
    } else {
      setIsReady(true);
    }

    const shippingAddress = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : [];

    if (!shippingAddress.address) {
      router.push('/shipping');
    }

    const data = localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : [];

    if (data !== undefined && typeof data === 'string') {
      // Set state to paymentMethod data in localStorage
      setPaymentMethod(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onSubmit) {
      localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));

      setOnSubmit(false);
      router.push('/checkout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSubmit]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOnSubmit(true);
  };

  return (
    isReady && (
      <FormContainer>
        <CheckoutSteps
          step1
          step2
          step3
          currentStep={'/payment'}
          currentUser={currentUser}
        />
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
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>

              <Form.Check
                className="my-3"
                type="radio"
                label="Paypal or Credit Card"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type="submit" variant="dark">
            Continue
          </Button>
        </Form>
      </FormContainer>
    )
  );
};

export default PaymentMethodForm;
