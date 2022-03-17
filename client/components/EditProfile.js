import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../hooks/use-request";
import Message from "./Message";

const EditProfile = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [bio, setBio] = useState("");

  const [message, setMessage] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${user.id}`,
    method: "patch",
    body: {
      email,
      password,
      name,
      image,
      gender,
      age,
      bio,
    },
    onSuccess: (user) => {
      console.log(user);
      setUpdateSuccess(true);
      Router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (user || updateSuccess) {
      setEmail(user.email);
      setName(user.name);
      setImage(user.image);
      setGender(user.gender);
      setAge(user.age);
      setBio(user.bio);
      setPassword("");
      setConfirmPassword("");
    }

    if (errors) {
      setLoadingUpdate(false);
      setShowErrors(true);
    }

    setTimeout(() => {
      setUpdateSuccess(false);
      setLoadingUpdate(false);
    }, 3000);
  }, [user, updateSuccess, errors]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowErrors(false);
    setLoadingUpdate(true);

    if (password !== confirmPassword) {
      setMessage("Password do not match");
      setLoadingUpdate(false);
    } else {
      doRequest();
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 40}`;
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        {message && <Message variant="danger">{message}</Message>}
        {showErrors ? errors : null}
        {updateSuccess && <Message variant="success">Profile Updated</Message>}

        <Col xs={12} xl={6}>
          <div className="px-0 mt-3 d-flex flex-row justify-content-between align-items-center">
            <div className="dashboard-profile-img m-3">
              <Image
                loader={myLoader}
                src={image || user.image}
                alt="profile image"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>

            <div className="name-image-box px-0 d-flex flex-column">
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="image" className="my-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </div>
          </div>

          <div className="px-0 d-flex flex-row justify-content-between align-items-center age-gender-box">
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

            <Form.Group controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </div>

          <Form.Group controlId="bio" className="my-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              placeholder="Enter bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} xl={6}>
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

          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {password === "" && confirmPassword === "" ? (
            <div className="px-0 py-2" style={{ color: "red" }}>
              {"Please enter password"}
            </div>
          ) : password !== "" && confirmPassword === "" ? (
            <div className="px-0 py-2" style={{ color: "red" }}>
              {"Please confirm password"}
            </div>
          ) : null}
          <Button type="submit" variant="dark">
            {loadingUpdate ? (
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
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EditProfile;
