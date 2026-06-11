'use client';

import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

import FormContainer from '../common/FormContainer';
import CheckoutSteps from '../cart/CheckoutSteps';

const ShippingForm = ({ currentUser }) => {
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [onSubmit, setOnSubmit] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    // Protect unauthorized access
    if (!currentUser) {
      router.push('/signin');
      return;
    } else {
      setIsReady(true);
    }

    const data = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : [];

    if (currentUser?.shippingAddress) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onSubmit) {
      const shippingAddress = {
        address,
        city,
        postalCode,
        country
      };

      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

      setOnSubmit(false);
      router.push('/payment');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSubmit]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOnSubmit(true);
  };

  return (
    isReady && (
      <>
        {storageReady
          ? (
            <FormContainer>
              <CheckoutSteps
                step1
                step2
                currentStep={'/shipping'}
                currentUser={currentUser}
              />
              <h1>Shipping</h1>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="address" className="my-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address ?? ''}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city" className="my-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={city ?? ''}
                    required
                    onChange={(e) => setCity(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="postalCode" className="my-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter postal code"
                    value={postalCode ?? ''}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="country" className="my-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={country ?? ''}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="dark">
                  Continue
                </Button>
              </Form>
            </FormContainer>
            )
          : null}
      </>
    )
  );
};

export default ShippingForm;
