import React, { useState } from "react";
// import Swiper core and required modules
import {
	Navigation,
	Pagination,
	Scrollbar,
	Zoom,
	Mousewheel,
	Keyboard,
} from "swiper";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

// Import Swiper styles
import NextImage from "../common/NextImage";
import Loader from "../common/Loader";

const ImageSwiper = ({ product }) => {
	const [imageArray, setImageArray] = useState([]);
	const [loading, setLoading] = useState(true);

	if (imageArray.length === 0 && product) {
		const filterImages = Object.values(product.images).filter(
			(image) => image !== null && image !== ""
		);

		setLoading(false);
		setImageArray(filterImages);
	}

	return loading ? (
		<Loader />
	) : (
		<Swiper
			// install Swiper modules
			className="mySwiper custom-swiper"
			modules={[Navigation, Pagination, Scrollbar, Zoom, Mousewheel, Keyboard]}
			spaceBetween={0}
			slidesPerView={1}
			navigation={{}}
			pagination={{
				clickable: true,
				type: "bullets",
			}}
			mousewheel={true}
			keyboard={{
				enabled: true,
				onlyInViewport: false,
			}}
			// scrollbar={{ draggable: true }}
			zoom={{}}
		>
			{imageArray.map((img, index) => (
				<SwiperSlide key={index}>
					<div
						className="product-main-img toggle-main-img"
						id={`side-img-${index}`}
					>
						<NextImage src={img} alt={`product_image_${index}`} />
					</div>
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default ImageSwiper;
