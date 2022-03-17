import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

import useRequest from "../hooks/use-request";
import Message from "./Message";

const EditSecurity = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${user.id}`,
    method: "patch",
    body: {
      email,
      isAdmin: user.isAdmin,
      name: user.name,
      image: user.image,
      gender: user.gender,
      age: user.age,
      bio: user.bio,
      jsonShippingAddress: user.shippingAddress,
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
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }

    if (errors) {
      setLoadingUpdate(false);
      setShowErrors(true);
    }

    setTimeout(() => {
      setUpdateSuccess(false);
      setLoadingUpdate(false);
    }, 5000);
  }, [user, updateSuccess, errors]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowErrors(false);
    setLoadingUpdate(true);

    if (newPassword !== confirmNewPassword) {
      setMessage("Password do not match");
      setLoadingUpdate(false);
    } else if (newPassword !== "") {
      doRequest({ password: password, newPassword: newPassword });
    } else {
      doRequest({ password: password });
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        {message && <Message variant="danger">{message}</Message>}
        {showErrors ? errors : null}
        {updateSuccess && <Message variant="success">Profile Updated</Message>}

        <Col>
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

          <Form.Group controlId="newPassword" className="my-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmNewPassword" className="my-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {password === "" ? (
            <div className="px-0 py-2" style={{ color: "red" }}>
              {"Please enter password"}
            </div>
          ) : null}
          {newPassword !== "" && confirmNewPassword === "" ? (
            <div className="px-0 py-2" style={{ color: "red" }}>
              {"Please confirm new password"}
            </div>
          ) : null}
          <Button
            type="submit"
            variant="dark"
            disabled={password !== "" ? false : true}
          >
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

export default EditSecurity;
