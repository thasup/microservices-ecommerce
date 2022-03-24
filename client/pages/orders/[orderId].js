import React, { useEffect, useState } from "react";
import {
  Col,
  ListGroup,
  Row,
  Card,
  Button,
  Container,
  Spinner,
} from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import StripeCheckout from "react-stripe-checkout";
import { PayPalButton } from "react-paypal-button-v2";

import NextImage from "../../components/NextImage";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useRequest from "../../hooks/use-request";
import ExpireTimer from "../../components/ExpireTimer";

const OrderPage = ({ currentUser, orders, users }) => {
  const { orderId } = useRouter().query;

  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const order = orders.find((order) => order.id === orderId);
  const user = users.find((user) => user.id === order.userId);

  const { doRequest: payOrder, errors: paymentErrors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {
      orderId: orderId,
    },
    onSuccess: (payment) => {
      setLoading(false);
      Router.push(`/orders/${orderId}`);
    },
  });

  const { doRequest: deliverOrder, errors: deliverErrors } = useRequest({
    url: `/api/orders/${orderId}/deliver`,
    method: "patch",
    body: {},
    onSuccess: (order) => {
      setLoadingDeliver(false);
      Router.push(`/orders/${orderId}`);
    },
  });

  useEffect(async () => {
    setLoading(false);

    const addPayPalScript = async () => {
      // Add paypal script to DOM
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=AdL_T7SNeUKaFYK8QBDWYsmFP3wKpIYtwzMOAVl8I2s6kvKImr47ImGxB9NbPFQA4kfGqt-ZNrRmBtgx`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    // Check if customer hasn't paid the order and chose to proceed with paypal
    if (order.paymentMethod === "paypal" && order.isPaid === false) {
      // Check if the page hasn't loaded with paypal, then
      if (!window.paypal && !paypalLoaded) {
        // just add the paypal script (and sdk ready)
        addPayPalScript();
      } else {
        // if page has loaded with paypal, then just set the sdk ready
        setSdkReady(true);
      }
    }
  }, [loadingPay, loadingDeliver, order]);

  const paypalPaymentHandler = () => {
    setLoadingPay(true);
    payOrder({ token: currentUser.id });
    setLoadingPay(false);
  };

  const deliverHandler = (e) => {
    e.preventDefault();
    setLoadingDeliver(true);
    deliverOrder();
  };

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
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
                <strong>Name: </strong> {user?.name.toUpperCase()}
              </p>
              <p>
                <strong>Email: </strong>

                <Link href={`mailto:${user?.email}`} passHref>
                  <a>{user?.email}</a>
                </Link>
              </p>
              <p className="mb-3">
                <strong>Address: </strong>
                {order.shippingAddress.address} {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.updatedAt?.substring(0, 10)}{" "}
                  {order.updatedAt?.substring(11, 16)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p>
                <strong>Method: </strong>
                <span className="text-uppercase">{order.paymentMethod}</span>
              </p>

              {order.status === "cancelled" ? (
                <Message variant="danger">Order Cancelled</Message>
              ) : order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt?.substring(0, 10)}{" "}
                  {order.paidAt?.substring(11, 16)}
                </Message>
              ) : (
                <Message variant="secondary">
                  Order will expire in <ExpireTimer order={order} />
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Order Items</h3>
              {order.cart.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.cart.map((item, index) => (
                    <ListGroup.Item key={index} id="cart-items">
                      <Row>
                        <Col md={2} xs={4} className="px-0">
                          <Link
                            href={`/products/[productId]`}
                            as={`/products/${item.productId}`}
                            passHref
                          >
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
                                href={`/products/[productId]`}
                                as={`/products/${item.productId}`}
                              >
                                <a className="cart-product-title mb-1">
                                  {item.title}
                                </a>
                              </Link>

                              <h6>
                                <strong>COLOR:</strong>{" "}
                                {item.color === null ? (
                                  <p style={{ color: "red" }}>
                                    Color not selected
                                  </p>
                                ) : (
                                  item.color
                                )}
                              </h6>

                              <h6>
                                <strong>SIZE:</strong>{" "}
                                {item.size === null ? (
                                  <p style={{ color: "red" }}>
                                    Size not selected
                                  </p>
                                ) : (
                                  item.size
                                )}
                              </h6>
                            </Col>

                            <Col md={4} className="cart-price">
                              {item.qty} x ${item.price * item.discount} = $
                              {(item.qty * item.price * item.discount).toFixed(
                                2
                              )}
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

              {!order.isPaid && order.status !== "cancelled" ? (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {order.paymentMethod === "paypal" && (
                    <>
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={paypalPaymentHandler}
                          onButtonReady={() => {
                            setPaypalLoaded(true);
                          }}
                        />
                      )}
                    </>
                  )}
                  {paymentErrors}
                  {order.paymentMethod === "stripe" && (
                    <StripeCheckout
                      token={({ id }) => {
                        setLoading(true);
                        payOrder({ token: id });
                      }}
                      stripeKey="pk_test_51KYCbpCqypc6uabtXBYVwjkCQxYJ02VlTebqSllPb0Kei5mvKN1brmzIgEeZK371eoKkh7rJxX70lr7wet0VfZjb00PDUgCK7c"
                      amount={order.totalPrice * 100}
                      email={currentUser.email}
                    />
                  )}
                </ListGroup.Item>
              ) : null}

              {deliverErrors}
              {currentUser?.isAdmin && order?.isPaid && !order.isDelivered && (
                <ListGroup.Item className="d-grid">
                  <Button type="button" variant="dark" onClick={deliverHandler}>
                    {loadingDeliver ? (
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
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
