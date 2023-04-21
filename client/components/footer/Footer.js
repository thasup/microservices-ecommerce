import React, { useState } from 'react';
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
										<Link href="/products/tops">
											<a>Top</a>
										</Link>
									</li>
									<li>
										<Link href="/products/bottoms">
											<a>Bottom</a>
										</Link>
									</li>
									<li>
										<Link href="/products/dresses">
											<a>Dress</a>
										</Link>
									</li>
									<li>
										<Link href="/products/sets">
											<a>Set</a>
										</Link>
									</li>
									<li>
										<Link href="/products/coats">
											<a>Coat</a>
										</Link>
									</li>
								</ul>
							</Col>

							<Col className="topic-footer" id="support">
								<h5>Support</h5>
								<ul className="footer-lists">
									<li>
										<Link href="/support/faq">
											<a>FAQ</a>
										</Link>
									</li>
									<li>
										<Link href="/support/sizing">
											<a>Sizing</a>
										</Link>
									</li>
									<li>
										<Link href="/support/accessibility">
											<a>Accessibility</a>
										</Link>
									</li>
									<li>
										<Link href="/support/return">
											<a>Return Policy</a>
										</Link>
									</li>
									<li>
										<Link href="/support/privacy">
											<a>Privacy Policy</a>
										</Link>
									</li>
									<li>
										<Link href="/support/terms">
											<a>Terms of Service</a>
										</Link>
									</li>
								</ul>
							</Col>

							<Col className="topic-footer" id="company">
								<h5>Company</h5>
								<ul className="footer-lists">
									<li>
										<Link href="/company/about">
											<a>About Us</a>
										</Link>
									</li>
									<li>
										<Link href="/company/mission">
											<a>Our Mission</a>
										</Link>
									</li>
									<li>
										<Link href="/company/careers">
											<a>Careers</a>
										</Link>
									</li>
									<li>
										<Link href="/company/contact">
											<a>Contact</a>
										</Link>
									</li>
									<li>
										<Link href="/company/sustainability">
											<a>Sustainability</a>
										</Link>
									</li>
									<li>
										<Link href="/company/press">
											<a>Press</a>
										</Link>
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
											  console.log(email);
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
