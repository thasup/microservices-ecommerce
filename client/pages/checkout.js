import React, { useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Card } from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";

import useRequest from "../hooks/use-request";
import CheckoutSteps from "../components/CheckoutSteps";
import NextImage from "../components/NextImage";
import Message from "../components/Message";
import buildClient from "../api/build-client";

const CheckoutPage = ({ currentUser }) => {
  const [storageReady, setStorageReady] = useState(false);
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingDiscount, setShippingDiscount] = useState(1);
  const [onSuccess, setOnSuccess] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      jsonCartItems: JSON.stringify(cart),
      jsonShippingAddress: JSON.stringify(shippingAddress),
      jsonPaymentMethod: JSON.stringify(paymentMethod),
    },
    onSuccess: (order) => {
      console.log(order);
      setOnSuccess(true);
      Router.push(`/orders/${order.id}`);
    },
  });

  useEffect(() => {
    const cartItemsData = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    const shippingData = localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : [];

    const paymentData = localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : [];

    // Cart has items or empty
    if (
      cartItemsData !== undefined &&
      shippingData !== undefined &&
      paymentData !== undefined
    ) {
      cartItemsData.map((item) => {
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
      localStorage.setItem("cartItems", []);
    }
  }, [onSuccess]);

  if (storageReady) {
    const itemsPrice = Number(
      cart.reduce((acc, item) => acc + item.price * item.qty * item.discount, 0)
    ).toFixed(2);
    const shippingPrice = (
      itemsPrice > 100.0 ? 0.0 : 10.0 * shippingDiscount
    ).toFixed(2);
    const taxPrice = (0.07 * itemsPrice).toFixed(2);
    const totalPrice = (
      Number(itemsPrice) +
      Number(shippingPrice) +
      Number(taxPrice)
    ).toFixed(2);
  }

  const checkoutHandler = (e) => {
    e.preventDefault();
    doRequest();
  };

  return storageReady ? (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>{" "}
                {currentUser.name ? currentUser.name : currentUser.id}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${currentUser.email}`}>{currentUser.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address} {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.map((item, index) => (
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
                            as={`/products/${item.productId}`}
                          >
                            <a>{item.title}</a>
                          </Link>
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
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
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
    </>
  ) : null;
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  // Redirect to signin page if user do not authorized
  if (data.currentUser === null) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}

export default CheckoutPage;
