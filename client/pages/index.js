import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Product from "../components/home/Product";
import ImageSwiper from '../components/common/ImageSwiper';
import useWindowSize from "../hooks/useWindowSize";

import AdsBannerSrc1 from "../public/asset/ads-banner/ads_banner_1.png";
import AdsBannerSrc2 from "../public/asset/ads-banner/ads_banner_2.png";
import AdsBannerSrc3 from "../public/asset/ads-banner/ads_banner_3.png";
import AdsBannerSrc4 from "../public/asset/ads-banner/ads_banner_4.png";
import AdsBannerSrc5 from "../public/asset/ads-banner/ads_banner_5.png";

const adsBanners = [AdsBannerSrc1, AdsBannerSrc2, AdsBannerSrc3, AdsBannerSrc4, AdsBannerSrc5]

const Home = ({ products, currentUser }) => {
	const [onMobile, setOnMobile] = useState(false);

	const { width } = useWindowSize();

	useEffect(() => {
		if (width <= 576) {
			setOnMobile(true);
		} else {
			setOnMobile(false);
		}
	}, [width]);

	return (
		<>
			<Row className="ads-container">
				<ImageSwiper images={adsBanners} />
			</Row>
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
		</>
	);
};

export default Home;
