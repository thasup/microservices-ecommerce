import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel } from "react-bootstrap";

import Loader from "./Loader";

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
    return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 50}`;
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
            src={image === "" ? "sf6t25da3113hl2/4te4tet.jpg" : image}
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
