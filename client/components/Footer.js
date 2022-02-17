import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            Copyright &copy; {currentYear}
            <span className="ms-2">
              <a target="_blank" href="https://thanachon.me">
                THASUP
              </a>
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
