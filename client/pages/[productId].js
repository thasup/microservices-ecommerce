import React, { useState } from "react";
import { useRouter } from "next/router";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, Zoom } from "swiper";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/hash-navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";

import NextImage from "../components/NextImage";
import buildClient from "../api/build-client";
import Loader from "../components/Loader";

const test = ({ products, currentUser }) => {
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const { productId } = useRouter().query;
  const product = products.find((product) => product.id === productId);

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
      modules={[Navigation, Pagination, Scrollbar, Zoom]}
      spaceBetween={10}
      slidesPerView={3}
      navigation={{}}
      pagination={{
        clickable: true,
      }}
      scrollbar={{ draggable: true }}
      zoom={{ maxRatio: 5 }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
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

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products");

  return { props: { products: data } };
}

export default test;
