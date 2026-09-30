'use client';

import { useEffect, useState } from 'react';
// Import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  Keyboard,
  Autoplay
} from 'swiper/modules';
import Image from 'next/image';

import Loader from './Loader';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';

const ImageSwiper = ({ images, isBanner = false }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setLoading(false);
    }
  }, [images]);

  return loading
    ? (
      <Loader />
      )
    : (
      <Swiper
        className="custom-swiper"
        style={{ aspectRatio: isBanner ? '3' : 'unset' }}
        modules={[Navigation, Pagination, Scrollbar, Mousewheel, Keyboard, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        loop={true}
        pagination={{
          clickable: true,
          type: 'bullets'
        }}
        mousewheel={false}
        keyboard={{
          enabled: true,
          onlyInViewport: false
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="ads-img">
              {isBanner
                ? (
                  <Image
                    src={img}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      objectPosition: 'center center'
                    }}
                    sizes="100vw"
                    priority
                    alt={`image_${index}`}
                  />
                  )
                : (
                  <Image
                    src={img}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center center'
                    }}
                    priority
                    alt={`image_${index}`}
                  />
                  )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      );
};

export default ImageSwiper;
