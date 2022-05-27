import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

import Product from "../../../components/home/Product";
import Loader from "../../../components/common/Loader";
import useWindowSize from "../../../hooks/useWindowSize";

const BottomsNewArrivals = ({ products, currentUser }) => {
	const [loading, setLoading] = useState(true);
	const [onMobile, setOnMobile] = useState(false);

	const { width } = useWindowSize();

	const bottomsNewArrivals = products
		?.filter((bottom) => bottom.category === "Bottom")
		.reverse();

	useEffect(() => {
		if (width <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}

		if (products && bottomsNewArrivals) {
			setLoading(false);
		}
	}, [width, products]);

	return (
		<>
			<Head>
				<title>New Arrivals Bottoms | Aurapan</title>
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
					<h1 className="category-header">New Arrivals Bottoms</h1>
					<Breadcrumb className="breadcrumb-label">
						<Link href="/" passHref>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
						</Link>

						<Link href="/products/bottoms" passHref>
							<Breadcrumb.Item>Bottoms</Breadcrumb.Item>
						</Link>

						<Link href="/products/bottoms/new" passHref>
							<Breadcrumb.Item>New Arrivals</Breadcrumb.Item>
						</Link>
					</Breadcrumb>

					<Row className="mx-0">
						{bottomsNewArrivals.map((item) => (
							<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
								<Product
									onMobile={onMobile}
									product={item}
									currentUser={currentUser}
								/>
							</Col>
						))}
					</Row>
				</>
			)}
		</>
	);
};

export default BottomsNewArrivals;
