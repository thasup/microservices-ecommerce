import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const AddToCart = ({ product, currentUser }) => {
  const [onAdd, setOnAdd] = useState(false);

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
        image: product.images.image1,
        price: product.price,
        countInStock: product.countInStock - 1,
        discount: 1,
        productId: product.id,
      };

      console.log("Started onAdd cartItems:", cartItems);
      // Check if the product exist in cart
      const existItem = cartItems.find((x) => x.productId === product.id);

      // If it existed, replace it with new data
      if (existItem) {
        cartItems = cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        cartItems.push(item);
        console.log("push!!", cartItems);
      }

      console.log("Finished onAdd cartItems:", cartItems);

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnAdd(false);
    }
  }, [onAdd]);

  const addToCartHandler = (e) => {
    e.preventDefault();
    setOnAdd(true);
  };

  return (
    <Button
      variant="dark"
      onClick={addToCartHandler}
      disabled={product.countInStock < 1}
    >
      Add To Cart
    </Button>
  );
};

export default AddToCart;
