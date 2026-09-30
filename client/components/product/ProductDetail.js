'use client';

/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';

import Rating from '../common/Rating';
import NextImage from '../common/NextImage';
import ProductImageSwiper from './ProductImageSwiper';
import SocialShare from './SocialShare';
import ColorSelector from '../common/ColorSelector';
import SizeSelector from '../common/SizeSelector';
import ProductDescription from './ProductDescription';
import Review from './Review';
import Coupon from './Coupon';
import AddToCart from '../common/AddToCart';
import QuantitySelector from '../common/QuantitySelector';
import YouMayAlsoLike from '../common/YouMayAlsoLike';
import useWindowSize from '../../hooks/useWindowSize';

const ProductDetail = ({ product, products, users, currentUser, myOrders }) => {
  const productId = product.id;

  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [discountFactor, setDiscountFactor] = useState(1);

  const [initialImage, setInitialImage] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [imageEvent, setImageEvent] = useState(null);

  const [isPurchase, setIsPurchase] = useState(false);
  const [onMobile, setOnMobile] = useState(false);

  const [screenWidth, setScreenWidth] = useState(0);

  const categoryParams = `${product?.category.toLowerCase()}${
    product?.category === 'Dress' ? 'es' : 's'
  }`;

  const { width } = useWindowSize();

  useEffect(() => {
    setScreenWidth(width);

    if (width <= 576) {
      setOnMobile(true);
    } else {
      setInitialImage(false);
      setOnMobile(false);
    }
  }, [width]);

  useEffect(() => {
    // Check if orders is not an empty array
    if (myOrders && myOrders.length !== 0) {
      // Check if user can write a review after purchased the product
      const hasPurchasedItem = myOrders.map((order) => {
        if (order.isPaid === true) {
          return order.cart.some((item) => item.productId === productId);
        }
        return false;
      });

      // If some order contains the purchased product set isPurchase to true
      if (hasPurchasedItem.includes(true)) {
        setIsPurchase(true);
      }
    }

    // Defined variable
    const mainImage = document.getElementsByClassName('product-main-img');
    const sideImage = document.getElementsByClassName('product-side-img');

    // Toggle the first image to show as a main image
    // when page load at first time on desktop screen
    if (!initialImage && !onMobile && mainImage.length > 0) {
      for (let i = 0; i < mainImage.length; i++) {
        mainImage[i].classList.remove('toggle-main-img');
        sideImage[i]?.classList.remove('toggle-side-img');
      }

      mainImage[0].classList.add('toggle-main-img');
      setInitialImage(true);
    }

    // Toggle 'toggle-main-img' class for image when user clicked on that side image
    if (imageEvent) {
      for (let i = 0; i < mainImage.length; i++) {
        mainImage[i].classList.remove('toggle-main-img');
        sideImage[i]?.classList.remove('toggle-side-img');
      }

      const currentId =
        imageEvent.target.parentElement.parentElement.id.slice(-1);

      mainImage[currentId].classList.add('toggle-main-img');

      imageEvent.target.parentElement.parentElement.classList.add(
        'toggle-side-img'
      );

      // Set image event to default
      setImageEvent(null);
    }

    // Limit quantity input by locked maximum and minimum from the product countInStock
    if (quantity > product.countInStock) {
      setQuantity(product.countInStock);
    } else if (quantity < 1) {
      setQuantity(1);
    }
  }, [product, initialImage, imageEvent, quantity, onMobile, myOrders]);

  if (imageArray.length === 0 && product) {
    const filterImages = Object.values(product.images).filter(
      (image) => image !== null && image !== ''
    );

    setImageArray(filterImages);
  }

  useEffect(() => {
    // Re-evaluate new filter images when the product had changed
    if (product) {
      const filterImages = Object.values(product?.images).filter(
        (image) => image !== null && image !== ''
      );

      setImageArray(filterImages);
      if (initialImage) {
        setInitialImage(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const colorSelectedHandler = (color) => {
    if (color !== null) {
      setColor(color);
    }
  };

  const sizeSelectedHandler = (size) => {
    if (size !== null) {
      setSize(size);
    }
  };

  const couponHandler = (factor) => {
    if (factor) {
      setDiscountFactor(factor);
    }
  };

  return (
    <div className="breadcrumb-label">
      <Breadcrumb className="pt-4">
        <Breadcrumb.Item linkAs={Link} href="/">
          Home
        </Breadcrumb.Item>

        <Breadcrumb.Item linkAs={Link} href={`/products/${categoryParams}`}>
          {product?.category}
        </Breadcrumb.Item>

        <Breadcrumb.Item linkAs={Link} href={`/products/${product?.id}`}>
          {product?.title}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row id="product-page">
        {onMobile ? (
          <Col className="mb-3">
            <ProductImageSwiper product={product} />
          </Col>
        ) : (
          <>
            <Col sm={1} className="mb-3">
              {imageArray.map((img, index) => (
                <div
                  className="product-side-img zoom-effect"
                  id={`side-img-${index}`}
                  key={index}
                  onClick={(e) => setImageEvent(e)}
                >
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={30}
                  />
                </div>
              ))}
            </Col>

            <Col sm={5} className="mb-3 position-relative">
              {imageArray.map((img, index) => (
                <div className="product-main-img" key={index}>
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={75}
                  />
                </div>
              ))}
            </Col>
          </>
        )}

        <Col sm={6}>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item className="py-0">
              <Rating value={product?.rating} mobile={false} />
            </ListGroup.Item>

            <ListGroup.Item>
              <h1>{product?.title}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              <h1 className="product-price">$ {product?.price}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Color</h3>
              <div className="my-1 px-0">
                <ColorSelector
                  product={product}
                  callback={colorSelectedHandler}
                  margin={'5px'}
                  size={'2rem'}
                  flex={'start'}
                />
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Size</h3>
              <div className="my-1 px-0">
                <SizeSelector
                  product={product}
                  width={'35px'}
                  callback={sizeSelectedHandler}
                />
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>QTY</h3>
              <QuantitySelector
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="product-desc my-1 px-0">
                <p>{product?.description}</p>
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <SocialShare product={product} />
            </ListGroup.Item>
          </ListGroup>

          <Card className="product-page-box">
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>Status:</h5>
                  </Col>
                  <Col>
                    <h6>
                      {product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </h6>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>Brand:</h5>
                  </Col>
                  <Col>
                    <h6>{product?.brand}</h6>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>Category:</h5>
                  </Col>
                  <Col>
                    <h6>{product?.category}</h6>
                  </Col>
                </Row>
              </ListGroup.Item>

              {product?.countInStock > 0 && (
                <>
                  <ListGroup.Item>
                    <Coupon callback={couponHandler} />
                  </ListGroup.Item>
                </>
              )}

              <ListGroup.Item className="d-grid">
                <AddToCart
                  product={product}
                  currentUser={currentUser}
                  color={color}
                  size={size}
                  quantity={quantity}
                  discountFactor={discountFactor}
                  lg={!!onMobile}
                />
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 pb-5">
        <Col sm={6} className="mb-3">
          <div className="px-0 mt-2">
            <ProductDescription product={product} />
          </div>
        </Col>

        <Col sm={6}>
          <Review
            product={product}
            users={users}
            isPurchase={isPurchase}
            currentUser={currentUser}
          />
        </Col>
      </Row>

      <Row className="mt-4 pb-5">
        <Col sm={12} className="mb-3">
          <div className="px-0 mt-2">
            <YouMayAlsoLike
              products={products}
              currentUser={currentUser}
              onMobile={onMobile}
              screenWidth={screenWidth}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
