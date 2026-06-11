'use client';

import React, { useEffect, useState } from 'react';
import { Button, Col, ListGroup, Row, Card, Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import useRequest from '../../hooks/useRequest';
import CheckoutSteps from '../cart/CheckoutSteps';
import NextImage from '../common/NextImage';
import Message from '../common/Message';

const CheckoutView = ({ currentUser }) => {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingDiscount] = useState(1); // TODO: apply overall discount feature

  const [onSuccess, setOnSuccess] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  let itemsPrice;
  let shippingPrice;
  let taxPrice;
  let totalPrice;

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      cart,
      shippingAddress,
      paymentMethod
    },
    onSuccess: (order) => {
      setOnSuccess(true);
      router.push(`/orders/${order.id}`);
    }
  });

  useEffect(() => {
    // Protect unauthorized access
    if (!currentUser) {
      router.push('/signin');
      return;
    }

    const cartItemsData = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];

    const shippingData = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : [];

    const paymentData = localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : [];

    // Cart has items or empty
    if (cartItemsData && shippingData && paymentData) {
      cartItemsData.forEach((item) => {
        item.userId = currentUser.id;
      });

      // Set cart state to cartItems in localStorage
      setCart(cartItemsData);
      setShippingAddress(shippingData);
      setPaymentMethod(paymentData);

      // Start render the page
      setStorageReady(true);
    }

    if (onSuccess) {
      localStorage.setItem('cartItems', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSuccess]);

  if (cart && storageReady) {
    itemsPrice = Number(
      cart.reduce((acc, item) => acc + item.price * item.qty * item.discount, 0)
    ).toFixed(2);

    shippingPrice = (
      itemsPrice > 100.0 ? 0.0 : 10.0 * shippingDiscount
    ).toFixed(2);

    taxPrice = (0.07 * itemsPrice).toFixed(2);

    totalPrice = (
      Number(itemsPrice) +
      Number(shippingPrice) +
      Number(taxPrice)
    ).toFixed(2);
  }

  const checkoutHandler = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <>
      {storageReady && (
        <Container className="app-container">
          <CheckoutSteps
            step1
            step2
            step3
            step4
            currentStep={'/checkout'}
            currentUser={currentUser}
          />
          <Row>
            <Col md={8} className="mb-3">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>Shipping</h3>
                  <p>
                    <strong>Name: </strong>{' '}
                    {currentUser?.name ? currentUser.name : currentUser.id}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${currentUser.email}`}>
                      {currentUser.email}
                    </a>
                  </p>
                  <p className="mb-0">
                    <strong>Address: </strong>
                    {shippingAddress.address} {shippingAddress.city},{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h3>Payment Method</h3>
                  <p>
                    <strong>Method: </strong>
                    <span className="text-uppercase">{paymentMethod}</span>
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h3>Order Items</h3>
                  {cart.length === 0
                    ? (
                      <Message>Your cart is empty</Message>
                      )
                    : (
                      <ListGroup variant="flush">
                        {cart.map((item, index) => (
                          <ListGroup.Item key={index} id="cart-items">
                            <Row>
                              <Col md={2} xs={4} className="px-0">
                                <Link href={`/products/${item.productId}`}>
                                  <div className="px-0 cart-img">
                                    <NextImage
                                      src={item.image}
                                      alt={item.title}
                                      priority={true}
                                      quality={50}
                                    />
                                  </div>
                                </Link>
                              </Col>

                              <Col md={10} xs={8}>
                                <Row>
                                  <Col md={8} className="mb-3 d-flex flex-column">
                                    <Link
                                      href={`/products/${item.productId}`}
                                      className="cart-product-title mb-1"
                                    >
                                      {item.title}
                                    </Link>

                                    <h6>
                                      <strong>COLOR:</strong>{' '}
                                      {item.color === null
                                        ? (
                                          <p style={{ color: 'red' }}>
                                            Color not selected
                                          </p>
                                          )
                                        : (
                                            item.color
                                          )}
                                    </h6>

                                    <h6>
                                      <strong>SIZE:</strong>{' '}
                                      {item.size === null
                                        ? (
                                          <p style={{ color: 'red' }}>
                                            Size not selected
                                          </p>
                                          )
                                        : (
                                            item.size
                                          )}
                                    </h6>
                                  </Col>

                                  <Col md={4}>
                                    {item.qty} x ${item.price * item.discount} =
                                    $
                                    {(
                                      item.qty *
                                      item.price *
                                      item.discount
                                    ).toFixed(2)}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Order Summary</h3>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Items</strong>
                      </Col>
                      <Col>${itemsPrice || 'N/A'}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Shipping</strong>
                      </Col>
                      <Col>${shippingPrice || 'N/A'}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Tax</strong>
                      </Col>
                      <Col>${taxPrice || 'N/A'}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total</strong>
                      </Col>
                      <Col>${totalPrice || 'N/A'}</Col>
                    </Row>
                  </ListGroup.Item>

                  {errors}
                  <ListGroup.Item className="d-grid gap-2">
                    <Button
                      type="button"
                      variant="dark"
                      disabled={cart.length === 0}
                      onClick={checkoutHandler}
                    >
                      Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default CheckoutView;
