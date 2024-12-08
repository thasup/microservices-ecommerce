import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import Router from 'next/router';
import Head from 'next/head';
import { BsStripe, BsPaypal, BsCash } from 'react-icons/bs';

import CheckoutSteps from '../components/cart/CheckoutSteps';
import FormContainer from '../components/common/FormContainer';

const PaymentPage = ({ currentUser }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [onSubmit, setOnSubmit] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Protect unauthorized access
    if (!currentUser) {
      return Router.push('/signin');
    } else {
      setIsReady(true);
    }

    const shippingAddress = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : [];

    if (!shippingAddress.address) {
      Router.push('/shipping');
    }

    const data = localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : [];

    if (data !== undefined) {
      // Set state to paymentMethod data in localStorage
      setPaymentMethod(data);
    }

    if (onSubmit) {
      localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));

      setOnSubmit(false);
      Router.push('/checkout');
    }
  }, [onSubmit]);

  const submitHandler = (e) => {
    e.preventDefault();
    setOnSubmit(true);
  };

  return (
    isReady && (
			<>
				<Head>
					<title>Payment Method | Aurapan</title>
				</Head>
				<FormContainer>
					<CheckoutSteps
						step1
						step2
						step3
						currentStep={'/payment'}
						currentUser={currentUser}
					/>
					<h1>Payment Method</h1>
					<Form onSubmit={submitHandler}>
						<Form.Group className='mb-3'>
							<Form.Label className="mb-3" as="legend">
								Select Method
							</Form.Label>
							<Col>
								<Form.Check
									className="d-flex align-items-center gap-2 py-3"
								>
									<Form.Check.Input
										type="radio"
										name="paymentMethod"
										value="stripe"
										checked={paymentMethod === 'stripe'}
										onChange={(e) => setPaymentMethod(e.target.value)}
										id="stripe"
									/>
									<Form.Check.Label className='d-flex align-items-center gap-2'>
										<BsStripe size="20px" />
										<p className='m-0 lh-1'>Stripe or Credit Card</p>
									</Form.Check.Label>
								</Form.Check>

								<Form.Check
									className="d-flex align-items-center gap-2 py-3"
									>
									<Form.Check.Input
										type="radio"
										id="paypal"
										name="paymentMethod"
										value="paypal"
										checked={paymentMethod === 'paypal'}
										onChange={(e) => setPaymentMethod(e.target.value)}
									/>
									<Form.Check.Label className='d-flex align-items-center gap-2'>
										<BsPaypal size="20px" />
										<p className='m-0 lh-1'>Paypal or Credit Card</p>
									</Form.Check.Label>
								</Form.Check>

								<Form.Check
									className="d-flex align-items-center gap-2 py-3"
								>
									<Form.Check.Input
										type="radio"
										id="cash"
										name="paymentMethod"
										value="cash"
										checked={paymentMethod === 'cash'}
										onChange={(e) => setPaymentMethod(e.target.value)}
									/>
									<Form.Check.Label className='d-flex align-items-center gap-2'>
										<BsCash size="20px" />
										<p className='m-0 lh-1'>Pay with cash</p>
									</Form.Check.Label>
								</Form.Check>
							</Col>
						</Form.Group>

						<Button type="submit" variant="dark">
							Continue
						</Button>
					</Form>
				</FormContainer>
			</>
    )
  );
};

export default PaymentPage;
