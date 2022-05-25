import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import Rating from "../common/Rating";
import AddToCart from "../common/AddToCart";
import ColorSelector from "../common/ColorSelector";

const Product = ({
	onMobile,
	product,
	currentUser,
	showAddToCart = true,
	showColors = true,
	showRating = true,
}) => {
	const [color, setColor] = useState(null);
	const [toggle, setToggle] = useState(false);

	const colorSelectedHandler = (color) => {
		if (color !== null) {
			setColor(color);
		}
	};

	const myLoader = ({ src, quality }) => {
		return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 20}`;
	};

	return (
		<Card className="mb-3 product-card">
			<div
				className="product-img"
				onMouseEnter={() => setToggle(true)}
				onMouseLeave={() => setToggle(false)}
				onTouchStart={toggle ? () => setToggle(false) : () => setToggle(true)}
			>
				<Link
					href={`/products/[productId]`}
					as={`/products/${product.id}`}
					passHref
				>
					<Card.Body
						className="product-img__cover"
						style={{ opacity: toggle ? "0" : "1" }}
					>
						<Image
							loader={myLoader}
							src={product.images.image1}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? "400px" : "800px"}
							alt={`${product.title} image 1`}
						/>
					</Card.Body>
				</Link>

				<Link
					href={`/products/[productId]`}
					as={`/products/${product.id}`}
					passHref
				>
					<Card.Body
						className="product-img__hover"
						style={{ opacity: toggle ? "1" : "0" }}
					>
						<Image
							loader={myLoader}
							src={product.images.image2}
							layout="fill"
							objectFit="cover"
							lazyBoundary={onMobile ? "400px" : "800px"}
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

			<Card.Body className="px-2 pb-0">
				<Row
					className="d-flex flex-row justify-content-between px-0 mx-0"
					style={{ minHeight: onMobile ? "6rem" : "4rem" }}
				>
					<Col xs={12} sm={9} className="card-product-title" as="h4">
						<Link
							href={`/products/[productId]`}
							as={`/products/${product.id}`}
							passHref
						>
							<a>{product.title}</a>
						</Link>
					</Col>

					<Col xs={12} sm={3} className="card-product-price">
						<h4
							style={{
								textAlign: onMobile ? "start" : "end",
								justifyContent: onMobile ? "flex-end" : "flex-start",
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
								mobile={onMobile ? true : false}
							/>
						</Col>
					)}

					{showColors && (
						<Col xs={7} className="card-product-color" as="div">
							<ColorSelector
								product={product}
								callback={colorSelectedHandler}
								margin={"2px"}
								size={onMobile ? "15px" : "25px"}
								flex={"end"}
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
