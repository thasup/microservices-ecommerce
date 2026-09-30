'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

import useRequest from '../../hooks/useRequest';
import Loader from '../common/Loader';

const SignupForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
      name,
      gender,
      age
    },
    onSuccess: () => {
      setLoading(false);
      router.push('/');
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
              <Link href="/signin">
                <Col className="banner-img">
                  <Image
                    loader={myLoader}
                    src="sign_in_banner_1.png"
                    fill
                    sizes="50vw"
                    style={{ objectFit: 'cover', objectPosition: 'left center' }}
                    priority
                    alt="sign in banner"
                  />
                </Col>
              </Link>

              <Col>
                <h1>Sign Up</h1>
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

                  <Form.Group controlId="name" className="my-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Row className="gender-age-form">
                    <Col sm={6} className="gender-form">
                      <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col sm={6} className="age-form">
                      <Form.Group controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  {showErrors ? errors : null}
                  <Button className="mt-3" type="submit" variant="dark">
                    Sign Up
                  </Button>
                </Form>

                <Row className="py-3">
                  <Col className="px-0">
                    Already have an account?{' '}
                    <Link href="/signin">Sign in</Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
          )}
    </>
  );
};

export default SignupForm;
