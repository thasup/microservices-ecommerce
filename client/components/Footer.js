import React from "react";
import Link from "next/link";
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
              <Link href="https://thanachon.me" passHref>
                <a target="_blank">THASUP</a>
              </Link>
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
