'use client';

import { useEffect, useState } from 'react';
// Import Swiper core and required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Product from '../home/Product';
import Loader from './Loader';

const YouMayAlsoLike = ({ products, currentUser, onMobile, screenWidth }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      // Shuffle suggested products
      const shuffled = [...products];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      setSuggestedProducts(shuffled.slice(0, 12));
      setLoading(false);
    }
  }, [products]);

  return loading
    ? (
      <Loader />
      )
    : (
      <>
        <h3 className="mb-3">You May Also Like</h3>
        <Swiper
          className="mySwiper custom-swiper you-may-also-like-section"
          style={{ boxShadow: 'none' }}
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
            type: 'progressbar'
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true
          }}
        >
          {suggestedProducts.map((product, index) => (
            <SwiperSlide key={index}>
              <Product
                product={product}
                currentUser={currentUser}
                onMobile={true}
                isMobileStyle={true}
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
