import React, { useEffect, useState } from "react";
// import Swiper core and required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

// Import Swiper styles
import Product from "../home/Product";
import Loader from "./Loader";

const YouMayAlsoLike = ({ products, currentUser, onMobile, screenWidth }) => {
	const [suggestedProducts, setSuggestedProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (products.length > 0) {
			// Shuffle suggested products
			for (let i = products.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const temp = products[i];
				products[i] = products[j];
				products[j] = temp;
			}

			setSuggestedProducts(products.slice(0, 12));
			setLoading(false);
		}
	}, [products]);

	return loading ? (
		<Loader />
	) : (
		<>
			<h3 className="mb-3">You May Also Like</h3>
			<Swiper
				// install Swiper modules
				className="mySwiper custom-swiper"
				style={{ boxShadow: "none" }}
				modules={[Navigation, Pagination, Mousewheel, Keyboard]}
				spaceBetween={0}
				slidesPerView={
					screenWidth
						? screenWidth >= 576
							? screenWidth >= 1024
								? 6
								: 4
							: 2
						: onMobile
						? 2
						: 6
				}
				loop={true}
				navigation={true}
				pagination={{
					clickable: true,
					type: "progressbar",
				}}
				// mousewheel={true}
				keyboard={{
					enabled: true,
					onlyInViewport: true,
				}}
			>
				{suggestedProducts.map((product, index) => (
					<SwiperSlide key={index}>
						<Product
							product={product}
							currentUser={currentUser}
							onMobile={true}
							showAddToCart={false}
							priority={true}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export default YouMayAlsoLike;
