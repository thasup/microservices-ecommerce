'use client';

import React, { useState } from 'react';
import {
  Col,
  ListGroup,
  Row,
  Card,
  Button,
  Container,
  Spinner
} from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

import NextImage from '../common/NextImage';
import Loader from '../common/Loader';
import Message from '../common/Message';
import useRequest from '../../hooks/useRequest';
import ExpireTimer from '../common/ExpireTimer';

// Publishable key (falls back to the key previously hardcoded in the
// react-stripe-checkout integration)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    'pk_test_51KYCbpCqypc6uabtXBYVwjkCQxYJ02VlTebqSllPb0Kei5mvKN1brmzIgEeZK371eoKkh7rJxX70lr7wet0VfZjb00PDUgCK7c'
);

// Client id (falls back to the client-id previously used in the manually
// injected PayPal SDK script)
const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ??
  'AdL_T7SNeUKaFYK8QBDWYsmFP3wKpIYtwzMOAVl8I2s6kvKImr47ImGxB9NbPFQA4kfGqt-ZNrRmBtgx';

// Inner form so useStripe/useElements run inside <Elements>
const StripeCardForm = ({ onToken }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const payHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setCardError(null);

    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      setCardError(error.message);
      setSubmitting(false);
      return;
    }

    onToken(token);
  };

  return (
    <form onSubmit={payHandler}>
      <div className="my-2 p-2 border rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {cardError && <Message variant="danger">{cardError}</Message>}
      <div className="d-grid">
        <Button type="submit" variant="dark" disabled={!stripe || submitting}>
          {submitting
            ? (
              <Spinner
                animation="border"
                role="status"
                as="span"
                size="sm"
                aria-hidden="true"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              )
            : null}{' '}
          Pay
        </Button>
      </div>
    </form>
  );
};

const OrderDetail = ({ order, currentUser }) => {
  const router = useRouter();

  const orderId = order.id;

  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const { doRequest: payOrder, errors: paymentErrors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId
    },
    onSuccess: () => {
      setLoading(false);
      setLoadingPay(false);
      router.refresh();
    }
  });

  const { doRequest: deliverOrder, errors: deliverErrors } = useRequest({
    url: `/api/orders/${orderId}/deliver`,
    method: 'patch',
    body: {},
    onSuccess: () => {
      setLoadingDeliver(false);
      router.refresh();
    }
  });

  const deliverHandler = (e) => {
    e.preventDefault();
    setLoadingDeliver(true);
    deliverOrder();
  };

  // Same success flow the old StripeCheckout/PayPalButton handlers used
  const successPaymentHandler = (token) => {
    setLoading(true);
    setLoadingPay(true);
    payOrder({ token });
  };

  return (
    <>
      {loading
        ? (
          <div
            className="d-flex justify-content-center align-items-center px-0"
            style={{ marginTop: '80px' }}
          >
            <Loader />
          </div>
          )
        : (
          <Container className="app-container">
            <div className="px-0">
              <h3>
                Order <span className="order-id">{order.id}</span>
              </h3>
            </div>
            <Row>
              <Col md={8} className="mb-3">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Shipping</h3>
                    <p>
                      <strong>Name: </strong>{' '}
                      {order.name ? order.name.toUpperCase() : order.userId}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      <a href={`mailto:${order.email ? order.email : ''}`}>
                        {order.email ? order.email : ''}
                      </a>
                    </p>
                    <p className="mb-3">
                      <strong>Address: </strong>
                      {order.shippingAddress.address}{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                    {order.isDelivered
                      ? (
                        <Message variant="success">
                          Delivered on {order.updatedAt?.substring(0, 10)}{' '}
                          {order.updatedAt?.substring(11, 16)}
                        </Message>
                        )
                      : (
                        <Message variant="danger">Not Delivered</Message>
                        )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h3>Payment Method</h3>
                    <p>
                      <strong>Method: </strong>
                      <span className="text-uppercase">
                        {order.paymentMethod}
                      </span>
                    </p>

                    {order.status === 'cancelled'
                      ? (
                        <Message variant="danger">Order Cancelled</Message>
                        )
                      : order.isPaid
                        ? (
                          <Message variant="success">
                            Paid on {order.paidAt?.substring(0, 10)}{' '}
                            {order.paidAt?.substring(11, 16)}
                          </Message>
                          )
                        : (
                          <Message variant="secondary">
                            Order will expire in <ExpireTimer order={order} />
                          </Message>
                          )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h3>Order Items</h3>
                    {order.cart.length === 0
                      ? (
                        <Message>Order is empty</Message>
                        )
                      : (
                        <ListGroup variant="flush">
                          {order.cart.map((item, index) => (
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
                                    <Col
                                      md={8}
                                      className="mb-3 d-flex flex-column"
                                    >
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

                                    <Col md={4} className="cart-price">
                                      {item.qty} x ${item.price * item.discount}{' '}
                                      = $
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
                        <Col>${order.itemsPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Shipping</strong>
                        </Col>
                        <Col>${order.shippingPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Tax</strong>
                        </Col>
                        <Col>${order.taxPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Total</strong>
                        </Col>
                        <Col>${order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>

                    {!order.isPaid && order.status !== 'cancelled'
                      ? (
                        <ListGroup.Item>
                          {paymentErrors}
                          {loadingPay
                            ? (
                              <Loader />
                              )
                            : (
                              <>
                                {order.paymentMethod === 'paypal' && (
                                  <PayPalScriptProvider
                                    options={{
                                      clientId: PAYPAL_CLIENT_ID,
                                      currency: 'USD'
                                    }}
                                  >
                                    <PayPalButtons
                                      createOrder={(data, actions) =>
                                        actions.order.create({
                                          purchase_units: [
                                            {
                                              amount: {
                                                value: order.totalPrice
                                              }
                                            }
                                          ]
                                        })
                                      }
                                      onApprove={async (data, actions) => {
                                        await actions.order.capture();
                                        successPaymentHandler(currentUser?.id);
                                      }}
                                    />
                                  </PayPalScriptProvider>
                                )}
                                {order.paymentMethod === 'stripe' && (
                                  <Elements stripe={stripePromise}>
                                    <StripeCardForm
                                      onToken={(token) =>
                                        successPaymentHandler(token.id)
                                      }
                                    />
                                  </Elements>
                                )}
                              </>
                              )}
                        </ListGroup.Item>
                        )
                      : null}

                    {deliverErrors}
                    {currentUser?.isAdmin &&
                      order?.isPaid &&
                      !order.isDelivered && (
                        <ListGroup.Item className="d-grid">
                          <Button
                            type="button"
                            variant="dark"
                            onClick={deliverHandler}
                          >
                            {loadingDeliver
                              ? (
                                <Spinner
                                  animation="border"
                                  role="status"
                                  as="span"
                                  size="sm"
                                  aria-hidden="true"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                                )
                              : null}{' '}
                            Mark As Delivered
                          </Button>
                        </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </Container>
          )}
    </>
  );
};

export default OrderDetail;
