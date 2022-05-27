import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Product from "../components/home/Product";
import useWindowSize from "../hooks/useWindowSize";

const Home = ({ products, currentUser }) => {
	const [onMobile, setOnMobile] = useState(false);

	const { width } = useWindowSize();

	useEffect(() => {
		// setScreenWidth(width);

		if (width <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}
	}, [width]);

	return (
		<Row className="mx-0">
			{products.map((item) => (
				<Col key={item.id} xs={6} md={4} xl={3} className="p-0">
					<Product
						onMobile={onMobile}
						product={item}
						currentUser={currentUser}
					/>
				</Col>
			))}
		</Row>
	);
};

export default Home;
