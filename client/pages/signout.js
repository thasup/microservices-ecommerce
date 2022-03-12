import React, { useEffect } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";
import { Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";

const signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <Row>
      <Col className="d-flex justify-content-center align-items-center">
        <Loader />
      </Col>
    </Row>
  );
};

export default signout;
