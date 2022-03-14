import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const QuantitySelector = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quantity > product.countInStock) {
      setQuantity(product.countInStock);
    } else if (quantity < 1) {
      setQuantity(1);
    }
  }, [quantity]);

  return (
    <div className="quantity-selector d-flex flex-row align-items-center">
      <div
        className="qty-btn decrease-btn"
        onClick={() => setQuantity(quantity - 1)}
      >
        -
      </div>
      <Form.Group controlId="countInStock" className="quantity-box">
        <Form.Control
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        ></Form.Control>
      </Form.Group>
      <div
        className="qty-btn decrease-btn"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </div>
    </div>
  );
};

export default QuantitySelector;
