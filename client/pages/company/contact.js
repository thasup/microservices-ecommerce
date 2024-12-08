import React from 'react';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';

import Support from '../../components/account/Support';

const ContactPage = () => {
  return (
		<>
			<Head>
				<title>Contact | Aurapan</title>
			</Head>
			<Container className="app-container">
				<Row>
					<Col className="banner-img">
						<h1>Account Setting</h1>
						<Support />
					</Col>
				</Row>
			</Container>
		</>
  );
};

export default ContactPage;
