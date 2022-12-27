import React, { useEffect, useState } from "react";
// import Swiper core and required modules
import {
	Navigation,
	Pagination,
	Scrollbar,
	Mousewheel,
	Keyboard,
	Autoplay,
} from "swiper";
import Image from 'next/image';

import Loader from './Loader';

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


const ImageSwiper = ({ images, isBanner = false }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (images.length > 0) {
			setLoading(false);
		}
	}, [images])

	return loading ? (
		<Loader />
	) : (
		<Swiper
			// install Swiper modules
			className="custom-swiper"
			modules={[Navigation, Pagination, Scrollbar, Mousewheel, Keyboard, Autoplay]}
			spaceBetween={0}
			slidesPerView={1}
			navigation={true}
			loop={true}
			pagination={{
				clickable: true,
				type: "bullets",
			}}
			mousewheel={false}
			keyboard={{
				enabled: true,
				onlyInViewport: false,
			}}
			autoplay={{
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}}
		>
			{images.map((img, index) => (
				<SwiperSlide key={index}>
					<div
						className="ads-img"
					>
						<Image
							src={img}
							layout={isBanner ? "responsive" : "fill"}
							objectFit="cover"
							objectPosition="center center"
							priority="true"
							alt={`image_${index}`} />
					</div>
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default ImageSwiper;
