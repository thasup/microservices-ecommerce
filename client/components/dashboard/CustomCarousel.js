import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel } from "react-bootstrap";

import Loader from "../common/Loader";

const CustomCarousol = ({ images, quality }) => {
	const [index, setIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [imageArray, setImageArray] = useState([]);

	useEffect(() => {
		if (images || reload) {
			setImageArray(images);

			setLoading(false);
		}
	}, [images]);

	const myLoader = ({ src, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 50}`;
		}
	};

	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	return loading ? (
		<>
			<Loader />
		</>
	) : (
		<Carousel
			className="carousel-product-parent"
			variant="dark"
			interval={null}
			activeIndex={index}
			onSelect={handleSelect}
		>
			{imageArray.map((image, index) => (
				<Carousel.Item key={index} className="carousel-product-item">
					<Image
						loader={myLoader}
						src={image === "" ? "gatmu67f52etjy2/4te4tet.webp" : image}
						alt={`product image ${index}`}
						layout="fill"
						objectFit="cover"
						quality={quality}
						priority
					/>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default CustomCarousol;
