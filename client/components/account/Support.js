import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';

import Message from '../common/Message';

const Support = ({ user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const showSuccessMessage = useMemo(() => !!successText, [successText]);
  const showErrorMessage = useMemo(() => !!errorText, [errorText]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    // Dummy
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        setSuccessText('Thank you for submit comment!');
      }, 1000);
    }
  }, [loading]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      setSuccessText('');
      setErrorText('Please fill out the form.');
      return;
    }

    setErrorText('');
    setLoading(true);
  };

  return (
		<Form onSubmit={submitHandler}>
			<Row>
				{showSuccessMessage && <Message variant="success">{successText}</Message>}
				{showErrorMessage && <Message variant="danger">{errorText}</Message>}

				<Col>
					<Form.Group controlId="name-contact" className="mb-3">
						<Form.Label>Your Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="email-contact" className="mb-3">
						<Form.Label>Your Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="subject" className="my-3">
						<Form.Label>Subject</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="message" className="my-3">
						<Form.Label>Message</Form.Label>
						<Form.Control
							as="textarea"
							style={{ height: '100px' }}
							placeholder="Write your message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type="submit" variant="dark">
						{loading
						  ? (
							<Spinner
								animation="border"
								role="status"
								as="span"
								size="sm"
								aria-hidden="true"
							>
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						    )
						  : null}{' '}
						Submit
					</Button>
				</Col>
			</Row>
		</Form>
  );
};

export default Support;
