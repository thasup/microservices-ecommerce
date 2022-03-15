import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Button, Card, Container } from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";

import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import NextImage from "../components/NextImage";

const CartPage = ({ currentUser }) => {
  const [productId, setProductId] = useState(null);
  const [onIncrease, setOnIncrease] = useState(false);
  const [onDecrease, setOnDecrease] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState(null);

  const [storageReady, setStorageReady] = useState(false);
  const [cart, setCart] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [onRemove, setOnRemove] = useState(false);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    // Cart has items or empty
    if (cartItems !== undefined) {
      // Set cart state to cartItems in localStorage
      setCart(cartItems);

      // Start render the page
      setStorageReady(true);
    }

    if (onEdit) {
      const existItem = cartItems.find((x) => x.productId === productId);

      let newQty;
      if (onIncrease) {
        newQty = existItem.qty + 1;
      } else if (onDecrease) {
        newQty = existItem.qty - 1;
      }

      if (newQty > existItem.countInStock + existItem.qty) {
        newQty = existItem.countInStock + existItem.qty;
      } else if (newQty < 1) {
        newQty = 1;
      }

      const editedItem = {
        userId: existItem.userId,
        title: existItem.title,
        qty: Number(newQty),
        image: existItem.image,
        price: existItem.price,
        countInStock: Number(existItem.countInStock + existItem.qty - newQty),
        discount: existItem.discount,
        productId: existItem.productId,
      };

      // If it existed, replace it with new data
      if (existItem) {
        cartItems = cartItems.map((x) =>
          x.productId === existItem.productId ? editedItem : x
        );
      } else {
        cartItems.push(editedItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      setOnIncrease(false);
      setOnDecrease(false);
      setOnEdit(false);
    }

    if (onRemove) {
      cartItems = cartItems.filter((item) => item.productId !== deletedItemId);

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnRemove(false);
    }
  }, [onIncrease, onDecrease, onRemove]);

  const editItemHandler = (id) => {
    setProductId(id);
    setOnEdit(true);
  };

  const removeFromCartHandler = (productId) => {
    setDeletedItemId(productId);
    setOnRemove(true);
  };

  const checkoutHandler = (e) => {
    e.preventDefault();
    if (!currentUser) {
      Router.push("/signin");
    } else {
      Router.push("/shipping");
    }
  };

  return storageReady ? (
    <Container className="app-container">
      <CheckoutSteps step1 currentStep={"/signin"} />
      <Row>
        <Col md={8}>
          <h3>Shopping Cart</h3>
          {cart.length === 0 ? (
            <Message variant="secondary">
              Your cart is empty. Keep shopping to find a cloth!{" "}
              <Link href="/">
                <a>Keep Shopping</a>
              </Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cart.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row id="cart-items">
                    <Col md={2}>
                      <Link
                        href={`/products/[productId]`}
                        as={`/products/${item.productId}`}
                        passHref
                      >
                        <div className="cart-img">
                          <NextImage
                            src={item.image}
                            alt={item.title}
                            priority={true}
                            quality={50}
                          />
                        </div>
                      </Link>
                    </Col>
                    <Col md={4}>
                      <Link
                        href={`/products/[productId]`}
                        as={`/products/${item.productId}`}
                      >
                        <a className="cart-product-title">{item.title}</a>
                      </Link>
                    </Col>
                    {item.discount !== 1 ? (
                      <>
                        <Col md={1} className="text-decoration-line-through">
                          ${item.price}
                        </Col>
                        <Col md={1}>${item.price * item.discount}</Col>
                      </>
                    ) : (
                      <>
                        <Col md={1}>${item.price}</Col>
                        <Col md={1}>{""}</Col>
                      </>
                    )}
                    <Col md={3}>
                      <div className="quantity-selector d-flex flex-row align-items-center">
                        <div
                          className="qty-btn decrease-btn"
                          onClick={() => {
                            editItemHandler(item.productId);
                            setOnDecrease(true);
                          }}
                        >
                          -
                        </div>
                        <div className="cart-quantity">{item.qty}</div>
                        <div
                          className="qty-btn increase-btn"
                          onClick={() => {
                            editItemHandler(item.productId);
                            setOnIncrease(true);
                          }}
                        >
                          +
                        </div>
                      </div>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="dark"
                        className="cart-trash-btn"
                        onClick={() => removeFromCartHandler(item.productId)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>
                  Subtotal (
                  {cart.reduce((acc, item) => acc + Number(item.qty), 0)}) items
                </h3>
                $
                {cart
                  .reduce(
                    (acc, item) => acc + item.qty * item.price * item.discount,
                    0
                  )
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item className="d-grid gap-2">
                <Button
                  type="button"
                  variant="dark"
                  disabled={cart.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Chackout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : null;
};

export default CartPage;
