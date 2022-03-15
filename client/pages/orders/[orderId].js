import React, { useEffect, useState } from "react";
import { Col, ListGroup, Row, Card, Button, Container } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import StripeCheckout from "react-stripe-checkout";
import { PayPalButton } from "react-paypal-button-v2";

import NextImage from "../../components/NextImage";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import ExpireTimer from "../../components/ExpireTimer";

const OrderPage = ({ currentUser, order }) => {
  const { orderId } = useRouter().query;

  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const { doRequest: payOrder, errors: paymentErrors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {
      orderId: orderId,
    },
    onSuccess: (payment) => {
      console.log(payment);
      setLoading(false);
      Router.push(`/orders/${orderId}`);
    },
  });

  const { doRequest: deliverOrder, errors: deliverErrors } = useRequest({
    url: `/api/orders/${orderId}/deliver`,
    method: "patch",
    body: {},
    onSuccess: (order) => {
      console.log(order);
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
    <Loader />
  ) : (
    <Container className="app-container">
      <h1>Order {order.id}</h1>
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Name: </strong>{" "}
                {currentUser.name ? currentUser?.name : currentUser?.id}
              </p>
              <p>
                <strong>Email: </strong>

                <Link href={`mailto:${currentUser.email}`} passHref>
                  <a>{currentUser.email}</a>
                </Link>
              </p>
              <p>
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
                    <ListGroup.Item key={index}>
                      <Row id="cart-items">
                        <Col md={2}>
                          <div className="px-0 cart-img">
                            <NextImage
                              src={item.image}
                              alt={item.title}
                              priority={true}
                              quality={50}
                            />
                          </div>
                        </Col>

                        <Col md={4} className="d-flex flex-column">
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
                              <p style={{ color: "red" }}>Color not selected</p>
                            ) : (
                              item.color
                            )}
                          </h6>

                          <h6>
                            <strong>SIZE:</strong>{" "}
                            {item.size === null ? (
                              <p style={{ color: "red" }}>Size not selected</p>
                            ) : (
                              item.size
                            )}
                          </h6>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price * item.discount} = $
                          {(item.qty * item.price * item.discount).toFixed(2)}
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
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
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

              {loadingDeliver && <Loader />}
              {deliverErrors}
              {currentUser?.isAdmin && order?.isPaid && !order.isDelivered && (
                <ListGroup.Item className="d-grid">
                  <Button type="button" variant="dark" onClick={deliverHandler}>
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

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  // Redirect to signin page if user do not authorized
  if (data.currentUser === null) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  } else {
    const { data: allMyOrder } = await client
      .get(`/api/orders/myorders`)
      .catch((err) => {
        console.log(err.message);
      });

    const existOrder = allMyOrder.find((order) => order.id === orderId);

    // If userId not match with userId in the order AND user is not an admin
    if (!existOrder && data.currentUser.isAdmin === false) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { data: order } = await client
      .get(`/api/orders/${orderId}`)
      .catch((err) => {
        console.log(err.message);
      });

    return { props: { order: order } };
  }
}

export default OrderPage;
