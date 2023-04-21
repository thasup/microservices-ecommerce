import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';

import Rating from '../common/Rating';
import AddToCart from '../common/AddToCart';
import ColorSelector from '../common/ColorSelector';

const Product = ({
  onMobile,
  product,
  currentUser,
  isMobileStyle = false,
  showAddToCart = true,
  showColors = true,
  showRating = true,
  priority = false
}) => {
  const [color, setColor] = useState(null);
  const [toggle, setToggle] = useState(null);

  const colorSelectedHandler = (color) => {
    if (color !== null) {
      setColor(color);
    }
  };

  const myLoader = ({ src, quality }) => {
    const isCloudinary = src.includes('aurapan');
    if (isCloudinary) {
      return `https://res.cloudinary.com/thasup/image/upload/q_${quality || 60}/${src}`;
    } else {
      return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 20}`;
    }
  };

		<Card className="mb-3 product-card">
  return (
			<div
				className="product-img"
				onMouseEnter={() => setToggle(true)}
				onMouseLeave={() => setToggle(false)}
				onTouchStart={toggle ? () => setToggle(false) : () => setToggle(true)}
			>
				<Link
					href={'/products/[productId]'}
					as={`/products/${product.id}`}
					passHref
				>
					<Card.Body
						className="product-img__cover"
						style={{ opacity: toggle ? '0' : '1' }}
					>
						<Image
							loader={myLoader}
							src={product.images.image1}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? '400px' : '800px'}
							priority={priority || false}
							alt={`${product.title} image 1`}
						/>
					</Card.Body>
				</Link>

				<Link
					href={'/products/[productId]'}
					as={`/products/${product.id}`}
					passHref
				>
					<Card.Body
						className="product-img__hover"
						style={{ opacity: toggle ? '1' : '0' }}
					>
						<Image
							loader={myLoader}
							src={product.images.image2}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? '400px' : '800px'}
							priority={priority || false}
							alt={`${product.title} image 2`}
						/>
					</Card.Body>
				</Link>

				{showAddToCart && !onMobile && (
					<div className="menu-tab" style={{ opacity: toggle ? "1" : "0" }}>
						<AddToCart
							product={product}
							currentUser={currentUser}
							color={color}
						/>
					</div>
				)}
			</div>

			<Card.Body className="p-0">
					<Row
						className="d-flex justify-content-between px-0 mx-0"
						style={{
						  flexDirection: isMobileStyle ? 'column' : (onMobile ? 'column' : 'row'),
						  minHeight: isMobileStyle ? '5.25rem' : (onMobile ? '5.25rem' : '4rem')
						}}
					>
						<Col xs={12} sm={9} className="card-product-title" as="h4"
							style={{
							  fontSize: isMobileStyle ? '1.1rem' : (onMobile && '1.1rem'),
							  minHeight: isMobileStyle ? '3rem' : (onMobile && '3rem')
							}}
						>
							<Link
								href={'/products/[productId]'}
								as={`/products/${product.id}`}
								passHref
							>
								<a>{product.title}</a>
							</Link>
						</Col>

						<Col xs={12} sm={3} className="card-product-price unselectable"
							style={{
							  textAlign: isMobileStyle ? 'start' : (onMobile ? 'start' : 'end'),
							  justifyContent: isMobileStyle ? 'flex-end' : (onMobile ? 'flex-end' : 'flex-start')
							}}
						>
							<h4
								style={{
								  fontSize: isMobileStyle ? '1.2rem' : (onMobile && '1.2rem')
								}}
							>
								${product.price}
							</h4>
						</Col>
					</Row>

					<Row className="d-flex flex-row justify-content-end align-items-center px-0 mx-0">
						{showRating && (
							<Col xs={5} className="card-product-reviews" as="div">
								<Rating
									value={product.rating}
									text={`(${product.numReviews})`}
									mobile={!!onMobile}
								/>
							</Col>
						)}

						{showColors && (
							<Col xs={7} className="card-product-color" as="div">
								<ColorSelector
									product={product}
									callback={colorSelectedHandler}
									margin={'2px'}
									size={onMobile ? '15px' : '25px'}
									flex={'end'}
								/>
							</Col>
						)}
					</Row>

					{showAddToCart && onMobile && (
						<AddToCart
							className="d-flex justify-content-center"
							product={product}
							currentUser={currentUser}
							color={color}
							lg={true}
						/>
					)}
			</Card.Body>
		</Card>
  );
};

export default Product;
