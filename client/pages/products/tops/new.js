import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

import Product from "../../../components/home/Product";
import Loader from "../../../components/common/Loader";

const TopsNewArrivals = ({ products, currentUser }) => {
	const [loading, setLoading] = useState(true);

	const topsNewArrivals = products
		.filter((top) => top.category === "Top")
		.reverse();

	useEffect(() => {
		if (products && topsNewArrivals) {
			setLoading(false);
		}
	}, []);

	return (
		<>
			<Head>
				<title>New Arrivals Tops | Aurapan</title>
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
					<h1 className="category-header">New Arrivals Tops</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/products/tops" passHref>
							<Breadcrumb.Item>Tops</Breadcrumb.Item>
						</Link>

						<Link href="/products/tops/new" passHref>
							<Breadcrumb.Item>New Arrivals</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{topsNewArrivals.map((item) => (
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

export default TopsNewArrivals;
