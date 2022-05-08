import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import useRequest from "../hooks/use-request";
import Loader from "../components/common/Loader";

const signin = ({ currentUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [isReady, setIsReady] = useState(false);

	const { doRequest, errors } = useRequest({
		url: "/api/users/signin",
		method: "post",
		body: {
			email,
			password,
		},
		onSuccess: () => {
			Router.back();
			setLoading(false);
		},
	});

	useEffect(() => {
		// Protect unauthorized access
		if (currentUser) {
			return Router.push("/");
		} else {
			setIsReady(true);
		}

		if (errors) {
			setLoading(false);
			setShowErrors(true);
		}
	}, [errors]);

	const submitHandler = async (event) => {
		event.preventDefault();

		setLoading(true);
		doRequest();
	};

	const myLoader = ({ src }) => {
		return `./asset/${src}`;
	};

	return (
		isReady && (
			<>
				<Head>
					<title>Sign In | Aurapan</title>
				</Head>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center px-0"
						style={{ marginTop: "80px" }}
					>
						<Loader />
					</div>
				) : (
					<Container className="app-container register-box">
						<Row>
							<Link href={`/signup`} passHref>
								<Col className="banner-img">
									<Image
										loader={myLoader}
										src="sign_up_banner_1.png"
										layout="fill"
										objectFit="cover"
										objectPosition="left center"
										priority="true"
										alt="sign up banner"
									/>
								</Col>
							</Link>

							<Col>
								<h1>Sign In</h1>
								<Form className="mt-3" onSubmit={submitHandler}>
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

									{showErrors ? errors : null}
									<Button className="mt-3" type="submit" variant="dark">
										Sign In
									</Button>
								</Form>

								<Row className="py-3">
									<Col className="px-0">
										New here?{" "}
										<Link href="/signup">
											<a>Create an Account</a>
										</Link>
									</Col>
								</Row>
							</Col>
						</Row>
					</Container>
				)}
			</>
		)
	);
};

export default signin;
