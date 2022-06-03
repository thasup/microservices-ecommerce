import React from "react";
import Image from "next/image";

const NextImage = ({ src, alt, priority, quality }) => {
	const myLoader = ({ src, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 70}`;
		}
	};

	return (
		<Image
			loader={myLoader}
			src={src}
			layout="fill"
			objectFit="cover"
			priority={priority || false}
			alt={alt}
		/>
	);
};

export default NextImage;
