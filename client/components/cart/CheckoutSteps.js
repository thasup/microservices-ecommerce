import React from 'react';
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
				<Link href={currentUser !== null ? '/cart' : '/signin'} passHref>
					<Nav.Link
						activekey={currentUser !== null ? '/cart' : '/signin'}
						disabled={!step1}
					>
						{currentUser !== null ? 'Cart' : 'Sign In'}
					</Nav.Link>
				</Link>
			</Nav.Item>

			<Nav.Item>
				<Link href="/shipping" passHref>
					<Nav.Link activekey="shipping" disabled={!step2}>
						Shipping
					</Nav.Link>
				</Link>
			</Nav.Item>

			<Nav.Item>
				<Link href="/payment" passHref>
					<Nav.Link activekey="payment" disabled={!step3}>
						Payment
					</Nav.Link>
				</Link>
			</Nav.Item>

			<Nav.Item>
				<Link href="/checkout" passHref>
					<Nav.Link activekey="checkout" disabled={!step4}>
						Checkout
					</Nav.Link>
				</Link>
			</Nav.Item>
		</Nav>
  );
};

export default CheckoutSteps;
