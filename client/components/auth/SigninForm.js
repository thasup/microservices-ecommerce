'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

import useRequest from '../../hooks/useRequest';
import Loader from '../common/Loader';

const SigninForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => {
      setLoading(false);
      router.back();
      router.refresh();
    }
  });

  useEffect(() => {
    if (errors) {
      setLoading(false);
      setShowErrors(true);
    }
  }, [errors]);

  const submitHandler = async (event) => {
    event.preventDefault();

    setLoading(true);
    doRequest();
  };

  const myLoader = ({ src }) => {
    return `./asset/${src}`;
  };

  return (
    <>
      {loading
        ? (
          <div
            className="d-flex justify-content-center align-items-center px-0"
            style={{ marginTop: '80px' }}
          >
            <Loader />
          </div>
          )
        : (
          <Container className="app-container register-box">
            <Row>
              <Link href="/signup">
                <Col className="banner-img">
                  <Image
                    loader={myLoader}
                    src="sign_up_banner_1.png"
                    fill
                    sizes="50vw"
                    style={{ objectFit: 'cover', objectPosition: 'left center' }}
                    priority
                    alt="sign up banner"
                  />
                </Col>
              </Link>

              <Col>
                <h1>Sign In</h1>
                <Form className="mt-3" onSubmit={submitHandler}>
                  <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  {showErrors ? errors : null}
                  <Button className="mt-3" type="submit" variant="dark">
                    Sign In
                  </Button>
                </Form>

                <Row className="py-3">
                  <Col className="px-0">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup">Sign up</Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
          )}
    </>
  );
};

export default SigninForm;
