import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Form, Button, Card } from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";

import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import NextImage from "../components/NextImage";

const CartPage = ({ currentUser }) => {
  const [productId, setProductId] = useState(null);
  const [qty, setQty] = useState(null);
  const [deletedItemId, setDeletedItemId] = useState(null);

  const [storageReady, setStorageReady] = useState(false);
  const [cart, setCart] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [onRemove, setOnRemove] = useState(false);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    console.log("initial storage cartItems:", cartItems);

    // Cart has items or empty
    if (cartItems !== undefined) {
      cartItems.map((item) => {
        item.countInStock += 1;
      });
      // Set cart state to cartItems in localStorage
      setCart(cartItems);

      // Start render the page
      setStorageReady(true);
    }

    if (onEdit) {
      console.log("Started onEdit cartItems:", cartItems);
      const existItem = cartItems.find((x) => x.productId === productId);

      const editedItem = {
        userId: existItem.userId,
        title: existItem.title,
        qty: qty,
        image: existItem.image,
        price: existItem.price,
        countInStock: existItem.countInStock,
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
        console.log("push!!", cartItems);
      }

      console.log("Finished onEdit cartItems:", cartItems);

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnEdit(false);
    }

    if (onRemove) {
      console.log("Started onRemove cartItems:", cartItems);
      cartItems = cartItems.filter((item) => item.productId !== deletedItemId);

      console.log("Finished onRemove cartItems:", cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnRemove(false);
    }
  }, [onEdit, onRemove]);

  const editItemHandler = (id, qty) => {
    setProductId(id);
    setQty(qty);
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
    <>
      <CheckoutSteps step1 />
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cart.length === 0 ? (
            <Message>
              Your cart is empty. Keep shopping to find a cloth!{" "}
              <Link href="/">
                <a>Keep Shopping</a>
              </Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cart.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <div className="cart-img">
                        <NextImage
                          src={item.image}
                          alt={item.title}
                          priority={true}
                          quality={50}
                        />
                      </div>
                    </Col>
                    <Col md>
                      <Link
                        href={`/products/[productId]`}
                        as={`/products/${item.productId}`}
                      >
                        <a>{item.title}</a>
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
                    <Col md={2}>
                      <Form.Control
                        className="form-select"
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          editItemHandler(
                            item.productId,
                            Number(e.target.value)
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((obj) => (
                          <option key={obj + 1} value={obj + 1}>
                            {obj + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="dark"
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
                <h2>
                  Subtotal (
                  {cart.reduce((acc, item) => acc + Number(item.qty), 0)}) items
                </h2>
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
    </>
  ) : null;
};

export default CartPage;
