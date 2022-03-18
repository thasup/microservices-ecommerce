import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

const AddToCart = ({ product, currentUser, color }) => {
  const [onAdd, setOnAdd] = useState(false);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [text, setText] = useState("Add To Cart");

  useEffect(() => {
    // Initial retrieve data from localStorage
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    if (onAdd) {
      // Create item to push in cart array then stored in localStorage
      const item = {
        userId: currentUser?.id || null,
        title: product.title,
        qty: 1,
        color: color || null,
        size: null,
        image: product.images.image1,
        price: product.price,
        countInStock: product.countInStock - 1,
        discount: 1,
        productId: product.id,
      };

      // Check if the product exist in cart
      const existItem = cartItems.find((x) => x.productId === product.id);

      // If it existed, replace it with new data
      if (existItem) {
        cartItems = cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnAdd(false);
      setTimeout(() => {
        setLoadingAddToCart(false);
        setText("Added!");
      }, 500);
    }

    return () => setText("Add To Cart");
  }, [onAdd]);

  const addToCartHandler = (e) => {
    e.preventDefault();
    setLoadingAddToCart(true);
    setOnAdd(true);
  };

  return (
    <Button
      className="add-to-cart-btn"
      variant="outline-dark"
      onClick={addToCartHandler}
      disabled={product.countInStock < 1}
    >
      {loadingAddToCart ? (
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
      {text}
    </Button>
  );
};

export default AddToCart;
