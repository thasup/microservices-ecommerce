'use client';

import { Nav } from 'react-bootstrap';
import Link from 'next/link';

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  currentStep,
  currentUser
}) => {
  return (
    <Nav
      variant="pills"
      className="justify-content-center my-4"
      id="checkout-step"
      defaultActiveKey={currentStep}
    >
      <Nav.Item>
        <Nav.Link
          as={Link}
          href={currentUser ? '/cart' : '/signin'}
          eventKey={currentUser ? '/cart' : '/signin'}
          disabled={!step1}
        >
          {currentUser ? 'Cart' : 'Sign In'}
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={Link} href="/shipping" eventKey="/shipping" disabled={!step2}>
          Shipping
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={Link} href="/payment" eventKey="/payment" disabled={!step3}>
          Payment
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={Link} href="/checkout" eventKey="/checkout" disabled={!step4}>
          Checkout
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
