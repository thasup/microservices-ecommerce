import React, { useEffect } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";
import { Col, Row, Spinner } from "react-bootstrap";

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
      <Col>
        <div>
          <h3>Signing you out</h3>
          <Spinner animatioon="grow" />
        </div>
      </Col>
    </Row>
  );
};

export default signout;
