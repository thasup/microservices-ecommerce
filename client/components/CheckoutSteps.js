import React from "react";
import { Nav } from "react-bootstrap";
import Link from "next/link";

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  currentStep,
  currentUser,
}) => {
  return (
    <Nav
      variant="pills"
      className="justify-content-center mb-4"
      id="checkout-step"
      defaultActiveKey={currentStep}
    >
      <Nav.Item>
        {currentUser.id ? (
          <>
            {step1 ? (
              <Link href="/cart" passHref>
                <Nav.Link activekey="cart">Cart</Nav.Link>
              </Link>
            ) : (
              <Nav.Link disabled>Cart</Nav.Link>
            )}
          </>
        ) : (
          <>
            {step1 ? (
              <Link href="/signin" passHref>
                <Nav.Link activekey="signin">Sign In</Nav.Link>
              </Link>
            ) : (
              <Nav.Link disabled>Sign In</Nav.Link>
            )}
          </>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Link href="/shipping" passHref>
            <Nav.Link activekey="shipping">Shipping</Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Link href="/payment" passHref>
            <Nav.Link activekey="payment">Payment</Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Link href="/checkout" passHref>
            <Nav.Link activekey="checkout">Checkout</Nav.Link>
          </Link>
        ) : (
          <Link href="/checkout" passHref>
            <Nav.Link disabled>Checkout</Nav.Link>
          </Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
