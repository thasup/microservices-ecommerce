import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Product from "../components/home/Product";

const Home = ({ products, currentUser }) => {
	const [onMobile, setOnMobile] = useState(null);
	const [showChild, setShowChild] = useState(false);
	const [screenWidth, setScreenWidth] = useState(0);

	useEffect(() => {
		// Check current window width to determine screen type
		function updateSize() {
			setScreenWidth(window.innerWidth);
		}

		window.addEventListener("resize", updateSize);
		updateSize();

		if (screenWidth <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}

		if (onMobile !== null) {
			setShowChild(true);
		}

		return () => window.removeEventListener("resize", updateSize);
	}, [screenWidth]);

	return (
		<>
			<Row className="mx-0">
				{products.map((item) => (
					<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
						{showChild && (
							<Product
								onMobile={onMobile}
								product={item}
								currentUser={currentUser}
							/>
						)}
					</Col>
				))}
			</Row>
		</>
	);
};

export default Home;
