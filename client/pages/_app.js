import React from "react";
import { Container } from "react-bootstrap";
import "../styles/globals.css";

const MyApp = (props) => {
  const { Component, pageProps, currentUser } = props;

  return (
    <>
      <Container fluid>
        <Component currentUser={currentUser} {...pageProps} />
      </Container>
    </>
  );
};

export default MyApp;
