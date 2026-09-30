'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');

  return (
    <footer>
      <Container>
        <Row className="flex-wrap">
          <Col className="d-flex flex-column justify-content-center">
            <Row className="upper-footer">
              <Col className="topic-footer" id="discover">
                <h5>Category</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="/products/tops">Top</Link>
                  </li>
                  <li>
                    <Link href="/products/bottoms">Bottom</Link>
                  </li>
                  <li>
                    <Link href="/products/dresses">Dress</Link>
                  </li>
                  <li>
                    <Link href="/products/sets">Set</Link>
                  </li>
                  <li>
                    <Link href="/products/coats">Coat</Link>
                  </li>
                </ul>
              </Col>

              <Col className="topic-footer" id="support">
                <h5>Support</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="/support/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/support/sizing">Sizing</Link>
                  </li>
                  <li>
                    <Link href="/support/accessibility">Accessibility</Link>
                  </li>
                  <li>
                    <Link href="/support/return">Return Policy</Link>
                  </li>
                  <li>
                    <Link href="/support/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/support/terms">Terms of Service</Link>
                  </li>
                </ul>
              </Col>

              <Col className="topic-footer" id="company">
                <h5>Company</h5>
                <ul className="footer-lists">
                  <li>
                    <Link href="/company/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/company/mission">Our Mission</Link>
                  </li>
                  <li>
                    <Link href="/company/careers">Careers</Link>
                  </li>
                  <li>
                    <Link href="/company/contact">Contact</Link>
                  </li>
                  <li>
                    <Link href="/company/sustainability">Sustainability</Link>
                  </li>
                  <li>
                    <Link href="/company/press">Press</Link>
                  </li>
                </ul>
              </Col>

              <Col className="topic-footer" id="connect">
                <Row className="topic-footer d-flex flex-column">
                  <h5>Newsletter</h5>
                  <div className="footer-newsletter">
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                    <Button
                      type="button"
                      variant="dark"
                      onClick={() => {
                        setEmail('');
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </Row>

                <Row className="topic-footer d-flex flex-column">
                  <h5>Connect With Us</h5>

                  <div className="social-media">
                    <a href="/" id="facebook">
                      <Image
                        src="/asset/facebook_b.png"
                        width={25}
                        height={25}
                        alt="facebook"
                      />
                    </a>
                    <a href="/" id="instagram">
                      <Image
                        src="/asset/instagram_b.png"
                        width={25}
                        height={25}
                        alt="Instagram"
                      />
                    </a>
                    <a href="/" id="twitter">
                      <Image
                        src="/asset/twitter_b.png"
                        width={25}
                        height={25}
                        alt="twitter"
                      />
                    </a>
                  </div>
                </Row>
              </Col>
            </Row>

            <Row className="lower-footer">
              <Col>
                Copyright &copy; {currentYear}
                <span className="ms-2">
                  <a
                    href="https://thanachon.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    THASUP
                  </a>
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
