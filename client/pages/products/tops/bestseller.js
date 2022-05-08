import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";

import Product from "../../../components/home/Product";
import Loader from "../../../components/common/Loader";

const TopsBestseller = ({ bestseller, currentUser }) => {
	const [loading, setLoading] = useState(true);

	const topsBestseller = bestseller.filter((top) => top.category === "Top");

	useEffect(() => {
		if (bestseller && topsBestseller) {
			setLoading(false);
		}
	}, []);

	return (
		<>
			<Head>
				<title>Bestseller Tops | Aurapan</title>
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
					<h1 className="category-header">Bestseller Tops</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/products/tops" passHref>
							<Breadcrumb.Item>Tops</Breadcrumb.Item>
						</Link>

						<Link href="/products/tops/bestseller" passHref>
							<Breadcrumb.Item>Bestseller</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{topsBestseller.map((item) => (
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

export default TopsBestseller;
