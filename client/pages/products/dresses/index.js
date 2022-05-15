import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";

import Loader from "../../../components/common/Loader";
import Product from "../../../components/home/Product";

const Dresses = ({ products, currentUser }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (products) {
			setLoading(false);
		}
	}, []);

	const dresses = products.filter((product) => product.category === "Dress");

	return (
		<>
			<Head>
				<title>Dresses | Aurapan</title>
			</Head>
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center px-0"
					style={{ marginTop: "80px" }}
				>
					<Loader />
				</div>
			) : (
				<>
					<h1 className="category-header">Dresses</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/products/dresses" passHref>
							<Breadcrumb.Item>Dresses</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{dresses.map((item) => (
							<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
								<Product product={item} currentUser={currentUser} />
							</Col>
						))}
					</Row>
				</>
			)}
		</>
	);
};

export default Dresses;
