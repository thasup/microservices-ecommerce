import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Form, Breadcrumb } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import Loader from "../../components/common/Loader";
import Rating from "../../components/common/Rating";
import NextImage from "../../components/common/NextImage";
import ImageSwiper from "../../components/product/ImageSwiper";
import SocialShare from "../../components/product/SocialShare";
import ColorSelector from "../../components/common/ColorSelector";
import SizeSelector from "../../components/common/SizeSelector";
import ProductDescription from "../../components/product/ProductDescription";
import Review from "../../components/product/Review";
import Coupon from "../../components/product/Coupon";
import AddToCart from "../../components/common/AddToCart";
import QuantitySelector from "../../components/common/QuantitySelector";

const productDetail = ({ products, users, currentUser, myOrders }) => {
	const { productId } = useRouter().query;

	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState(null);
	const [size, setSize] = useState(null);
	const [discountFactor, setDiscountFactor] = useState(1);

	const [initialImage, setInitialImage] = useState(false);
	const [imageArray, setImageArray] = useState([]);
	const [imageEvent, setImageEvent] = useState(null);

	const [isPurchase, setIsPurchase] = useState(false);
	const [onMobile, setOnMobile] = useState(false);
	const [showChild, setShowChild] = useState(false);

	const [screenWidth, setScreenWidth] = useState(0);

	useEffect(() => {
		function updateSize() {
			setScreenWidth(window.innerWidth);
		}

		window.addEventListener("resize", updateSize);
		updateSize();

		// Check current window width to determine screen type
		if (screenWidth <= 576) {
			setOnMobile(true);
		} else {
			setInitialImage(false);
			setOnMobile(false);
		}

		return () => window.removeEventListener("resize", updateSize);
	}, [screenWidth]);

	useEffect(async () => {
		//Check if orders is not an empty array
		if (myOrders && myOrders.length !== 0) {
			// Check if user can write a review after purchased the product
			const hasPurchasedItem = await myOrders.map((order) => {
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
		const mainImage = document.getElementsByClassName("product-main-img");
		const sideImage = document.getElementsByClassName("product-side-img");

		// Toggle the first image to show as a main image
		// when page load at first time on desktop screen
		if (!initialImage && !onMobile) {
			for (let i = 0; i < mainImage.length; i++) {
				mainImage[i].classList.remove("toggle-main-img");
				sideImage[i].classList.remove("toggle-side-img");
			}

			mainImage[0].classList.add("toggle-main-img");
			setInitialImage(true);
		}

		// Show child after set main image
		setShowChild(true);

		// Toggle 'toggle-main-img' class for image when user clicked on that side image
		if (imageEvent) {
			for (let i = 0; i < mainImage.length; i++) {
				mainImage[i].classList.remove("toggle-main-img");
				sideImage[i].classList.remove("toggle-side-img");
			}

			const currentId =
				imageEvent.target.parentElement.parentElement.id.slice(-1);

			mainImage[currentId].classList.add("toggle-main-img");

			imageEvent.target.parentElement.parentElement.classList.add(
				"toggle-side-img"
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
	}, [showChild, initialImage, imageEvent, quantity]);

	const product = products.find((product) => product.id === productId);

	if (imageArray.length === 0 && product) {
		const filterImages = Object.values(product.images).filter(
			(image) => image !== null && image !== ""
		);

		setImageArray(filterImages);
	}

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
		<>
			<Head>
				<title>{product.title} | Aurapan</title>
			</Head>
			<div className="breadcrumb-label">
				{!product.id || product.id !== productId ? (
					<div
						className="d-flex justify-content-center align-items-center px-0"
						style={{ marginTop: "80px" }}
					>
						<Loader />
					</div>
				) : (
					<>
						<Breadcrumb className="pt-4">
							<Link href="/" passHref>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
							</Link>

							<Link
								href="/products/[productId]"
								as={`/products/${product.id}`}
								passHref
							>
								<Breadcrumb.Item>{product.title}</Breadcrumb.Item>
							</Link>
						</Breadcrumb>

						<Row id="product-page">
							{onMobile ? (
								<Col className="mb-3">
									<ImageSwiper product={product} />
								</Col>
							) : (
								<>
									<Col sm={1} className="mb-3">
										{imageArray.map((img, index) => (
											<div
												className="product-side-img"
												id={`side-img-${index}`}
												key={index}
												onClick={(e) => setImageEvent(e)}
											>
												{showChild && (
													<NextImage
														src={img}
														alt={`product_image_${index}`}
														priority={true}
														quality={30}
													/>
												)}
											</div>
										))}
									</Col>

									<Col sm={5} className="mb-3 position-relative">
										{imageArray.map((img, index) => (
											<div className="product-main-img" key={index}>
												{showChild && (
													<NextImage
														src={img}
														alt={`product_image_${index}`}
														priority={true}
														quality={75}
													/>
												)}
											</div>
										))}
									</Col>
								</>
							)}

							<Col sm={6}>
								<ListGroup variant="flush" className="mb-3">
									<ListGroup.Item className="py-0">
										<Rating value={product.rating} mobile={false} />
									</ListGroup.Item>
									<ListGroup.Item>
										<h1>{product.title}</h1>
									</ListGroup.Item>
									<ListGroup.Item>
										<h1 id="price">$ {product.price}</h1>
									</ListGroup.Item>
									<ListGroup.Item>
										<h3>Color</h3>
										<div className="my-1 px-0">
											<ColorSelector
												product={product}
												callback={colorSelectedHandler}
												margin={"5px"}
												size={"2rem"}
												flex={"start"}
											/>
										</div>
									</ListGroup.Item>
									<ListGroup.Item>
										<h3>Size</h3>
										<div className="my-1 px-0">
											<SizeSelector
												product={product}
												width={"35px"}
												callback={sizeSelectedHandler}
											/>
										</div>
									</ListGroup.Item>
									<ListGroup.Item>
										<h3>QTY</h3>
										{/* <div className="my-1 quantity-selector d-flex flex-row align-items-center">
											<div
												className="qty-btn decrease-btn"
												onClick={() => setQuantity(quantity - 1)}
											>
												-
											</div>

											<Form.Group
												controlId="countInStock"
												className="quantity-box"
											>
												<Form.Control
													type="number"
													value={quantity}
													onChange={(e) => setQuantity(Number(e.target.value))}
												></Form.Control>
											</Form.Group>

											<div
												className="qty-btn increase-btn"
												onClick={() => setQuantity(quantity + 1)}
											>
												+
											</div>
										</div> */}
										<QuantitySelector
											product={product}
											quantity={quantity}
											setQuantity={setQuantity}
										/>
									</ListGroup.Item>

									<ListGroup.Item>
										<div className="my-1 px-0">
											<p>{product.description}</p>
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
														{product.countInStock > 0
															? "In Stock"
															: "Out of Stock"}
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
													<h6>{product.brand}</h6>
												</Col>
											</Row>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>
													<h5>Category:</h5>
												</Col>
												<Col>
													<h6>{product.category}</h6>
												</Col>
											</Row>
										</ListGroup.Item>

										{product.countInStock > 0 && (
											<>
												<ListGroup.Item>
													<Coupon callback={couponHandler} />
												</ListGroup.Item>
											</>
										)}

										<ListGroup.Item className="d-grid">
											{color === null && size === null ? (
												<div className="px-0 py-2" style={{ color: "red" }}>
													{"Please select color and size option"}
												</div>
											) : color === null && size !== null ? (
												<div className="px-0 py-2" style={{ color: "red" }}>
													{"Please select color option"}
												</div>
											) : color !== null && size === null ? (
												<div className="px-0 py-2" style={{ color: "red" }}>
													{"Please select size option"}
												</div>
											) : null}

											<AddToCart
												product={product}
												currentUser={currentUser}
												color={color}
												size={size}
												quantity={quantity}
												discountFactor={discountFactor}
												lg={onMobile ? true : false}
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
					</>
				)}
			</div>
		</>
	);
};

export default productDetail;
