import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center">
            <Row className="upper-footer">
              <Col
                className="topic-footer d-flex flex-column justify-content-center"
                id="discover"
              >
                <h5>Support</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="#">
                      <a>How Histovie works</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>FAQs</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Accessibility</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Terms of Use</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Privacy</a>
                    </Link>
                  </li>
                </ul>
              </Col>

              <Col
                className="topic-footer d-flex flex-column justify-content-center"
                id="support"
              >
                <h5>Discover More</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="#">
                      <a>Only on Histovie</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Histovie Studio</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Histovie Device</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Histovie Apps</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Affiliates</a>
                    </Link>
                  </li>
                </ul>
              </Col>

              <Col
                className="topic-footer d-flex flex-column justify-content-center"
                id="about"
              >
                <h5>Connect With Us</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="#">
                      <a>About Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>Contact Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>join Us</a>
                    </Link>
                  </li>
                </ul>

                <div className="social-media">
                  <a href="#" className="github">
                    <Image
                      src="/asset/github_b.png"
                      width={50}
                      height={50}
                      alt="github"
                    />
                  </a>
                  <a href="#" className="linkedin">
                    <Image
                      src="/asset/linkedin_b.png"
                      width={50}
                      height={50}
                      alt="LinkedIn"
                    />
                  </a>
                  <a href="#" className="instagram">
                    <Image
                      src="/asset/instagram_b.png"
                      width={50}
                      height={50}
                      alt="Instagram"
                    />
                  </a>
                </div>
              </Col>
            </Row>

            <Row className="lower-footer">
              <Col>
                Copyright &copy; {currentYear}
                <span className="ms-2">
                  <Link href="https://thanachon.me" passHref>
                    <a target="_blank">THASUP</a>
                  </Link>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
