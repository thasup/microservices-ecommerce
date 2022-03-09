import React, { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Col, ListGroup, Row, Card, Button } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import StripeCheckout from "react-stripe-checkout";

import NextImage from "../../components/NextImage";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const OrderPage = ({ currentUser }) => {
  const { orderId } = useRouter().query;

  const [sdkReady, setSdkReady] = useState(false);
  //   const [clientId, setClientId] = useState(null);
  //   const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [order, setOrder] = useState(null);

  // const { doRequest: fetchPaypalId, errors: fetchIdErrors } = useRequest({
  //   url: "/api/paypal",
  //   method: "get",
  //   body: {},
  //   onSuccess: ({ paypalClientId: data }) => {
  //     console.log(data);
  //     setClientId(data);
  //     setLoading(false);
  //   },
  // });

  const { doRequest: fetchOrder, errors: orderErrors } = useRequest({
    url: `/api/orders/${orderId}`,
    method: "get",
    body: {},
    onSuccess: (order) => {
      console.log(order);
      setOrder(order);
    },
  });

  const { doRequest: payOrder, errors: paymentErrors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {
      orderId: orderId,
    },
    onSuccess: (payment) => {
      console.log(payment);
      setLoading(false);
    },
  });

  useEffect(async () => {
    if (!currentUser) {
      Router.push("/signin");
    }

    // Fetch the order from client-side
    await fetchOrder();

    if (currentUser.isAdmin !== true && currentUser.id !== order.userId) {
      Router.push("/");
    }
    setLoading(false);

    const addPayPalScript = async () => {
      // Add paypal script to DOM
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=AdL_T7SNeUKaFYK8QBDWYsmFP3wKpIYtwzMOAVl8I2s6kvKImr47ImGxB9NbPFQA4kfGqt-ZNrRmBtgx`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    // Check if customer has paid the order or the order has been delivered, then
    if (!order || order.id !== orderId) {
      fetchOrder();
    }
    // Check if customer hasn't paid the order and chose to proceed with paypal
    else if (order.paymentMethod === "paypal" && order.isPaid === false) {
      // Check if the page hasn't loaded with paypal, then
      if (!window.paypal) {
        // just add the paypal script (and sdk ready)
        addPayPalScript();
      } else {
        // if page has loaded with paypal, then just set the sdk ready
        setSdkReady(true);
      }
    }
  }, [loading]);

  const paypalPaymentHandler = (paymentResult) => {
    setLoadingPay(true);
    updateOrder(orderId, paymentResult);
    setLoadingPay(false);
  };

  //   const stripePaymentHandler = () => {
  //     setLoadingPay(true);
  //     payOrder();
  //     setLoadingPay(false);
  //   };

  const deliverHandler = () => {};

  return loading ? (
    <Loader />
  ) : orderErrors ? (
    { orderErrors }
  ) : (
    <>
      <h1>Order {order.id}</h1>
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.userId}
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
                  Delivered on {order.updatedAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.updatedAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.cart.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.cart.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
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
                        <Col>
                          <Link
                            href={"/products/[productId]"}
                            as={`/products/${item.product}`}
                            passHref
                          >
                            <a>{item.title}</a>
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {item.qty * item.price * item.discount}
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
                <h2>Order Summary</h2>
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

              {!order.isPaid && (
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
              )}
              {/* {loadingDeliver && <Loader />} */}
              {currentUser &&
                currentUser.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item className="d-grid">
                    <Button
                      type="button"
                      variant="outline-dark"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

// export async function getStaticProps() {
//   const aaa = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
//   console.log("from static props:", aaa);

//   data = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;

//   return { props: { clientId: data } };
// }

// export async function getStaticPaths() {
//   //   const { data } = await client.get(`/api/config/paypal`);

//   return {
//     paths: [{ params: { orderId: "62278ec155c7220b750bf054" } }],
//     fallback: "blocking", // false or 'blocking'
//   };
// }

export default OrderPage;
