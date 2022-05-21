import React, { useEffect, useState } from "react";
import {
	Row,
	Col,
	ListGroup,
	Button,
	Card,
	Container,
	Form,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Message from "../components/common/Message";
import CheckoutSteps from "../components/cart/CheckoutSteps";
import NextImage from "../components/common/NextImage";

const CartPage = ({ currentUser, products }) => {
	const [cart, setCart] = useState(null);
	const [color, setColor] = useState([]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [size, setSize] = useState([]);
	const [selectedSize, setSelectedSize] = useState(null);
	const [productId, setProductId] = useState(null);
	const [deletedItemId, setDeletedItemId] = useState(null);
	const [toolTipText, setToolTipText] = useState("");

	const [storageReady, setStorageReady] = useState(false);
	const [onEdit, setOnEdit] = useState(false);
	const [onIncrease, setOnIncrease] = useState(false);
	const [onDecrease, setOnDecrease] = useState(false);
	const [onRemove, setOnRemove] = useState(false);

	useEffect(() => {
		// Get cartItems from LocalStorage
		let cartItems = localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [];

		// cartItems haves items
		if (cartItems !== undefined && cartItems !== null) {
			// Set cart state to cartItems in localStorage
			setCart(cartItems);

			// Set initial value of color and size in form-select
			const emptyColorArray = [];
			const emptySizeArray = [];
			cartItems.forEach((item) => {
				emptyColorArray.push(item.color);
				emptySizeArray.push(item.size);
			});
			setColor(emptyColorArray);
			setSize(emptySizeArray);

			// Start render the page
			setStorageReady(true);
		}

		// Run when update an item
		if (onEdit) {
			const existItem = cartItems.find((item) => item.productId === productId);

			let newQty = existItem.qty;

			// Update new quantity
			if (onIncrease) {
				newQty = existItem.qty + 1;
			} else if (onDecrease) {
				newQty = existItem.qty - 1;
			}

			// Limit maximun and minimum range
			if (newQty > existItem.countInStock + existItem.qty) {
				newQty = existItem.countInStock + existItem.qty;
			} else if (newQty < 1) {
				newQty = 1;
			}

			// Update new Item
			const editedItem = {
				userId: existItem.userId,
				title: existItem.title,
				qty: Number(newQty),
				color: selectedColor !== null ? selectedColor : existItem.color,
				size: selectedSize !== null ? selectedSize : existItem.size,
				image: existItem.image,
				price: existItem.price,
				countInStock: Number(existItem.countInStock + existItem.qty - newQty),
				discount: existItem.discount,
				productId: existItem.productId,
			};

			// If it existed, replace it with new data
			if (existItem) {
				cartItems = cartItems.map((item) =>
				item.productId === existItem.productId ? editedItem : item
				);
			} else {
				cartItems.push(editedItem);
			}

			// Set cartItems with updated data in localStorage
			localStorage.setItem("cartItems", JSON.stringify(cartItems));

			// Set cart with updated data in client state
			setCart(cartItems);

			// Reset parameter to default
			setSelectedColor(null);
			setSelectedSize(null);
			setOnIncrease(false);
			setOnDecrease(false);
			setOnEdit(false);
		}

		// Run when delete an item
		if (onRemove) {
			cartItems = cartItems.filter((item) => item.productId !== deletedItemId);

			localStorage.setItem("cartItems", JSON.stringify(cartItems));
			setOnRemove(false);
		}
	}, [onIncrease, onDecrease, onEdit, onRemove, currentUser]);

	const editItemHandler = (id) => {
		setProductId(id);
		setOnEdit(true);
	};

	const removeFromCartHandler = (productId) => {
		setDeletedItemId(productId);
		setOnRemove(true);
	};

	const checkoutHandler = (e) => {
		e.preventDefault();
		if (!currentUser) {
			Router.push("/signin");
		} else {
			Router.push("/shipping");
		}
	};

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			{toolTipText}
		</Tooltip>
	);

	return (
		<>
			<Head>
				<title>Cart | Aurapan</title>
			</Head>
			{storageReady ? (
				<Container className="app-container">
					<CheckoutSteps
						step1
						currentStep={currentUser?.id ? "/cart" : "/signin"}
						currentUser={currentUser}
					/>
					<Row>
						<Col md={8} className="mb-3">
							<h3>Shopping Cart</h3>
							{cart.length === 0 ? (
								<Message variant="secondary">
									Your cart is empty. Keep shopping to find a cloth!{" "}
									<Link href="/">
										<a>Keep Shopping</a>
									</Link>
								</Message>
							) : (
								<ListGroup variant="flush">
									{cart.map((item, index) => (
										<ListGroup.Item key={index} id="cart-items">
											<Row>
												<Col md={2} xs={4}>
													<Link
														href={`/products/[productId]`}
														as={`/products/${item.productId}`}
														passHref
													>
														<div className="cart-img">
															<NextImage
																src={item.image}
																alt={item.title}
																priority={true}
																quality={50}
															/>
														</div>
													</Link>
												</Col>

												<Col md={10} xs={8}>
													<Row className="justify-content-between">
														<Col md={5} className="mb-3 d-flex flex-column">
															<Link
																href={`/products/[productId]`}
																as={`/products/${item.productId}`}
																passHref
															>
																<a className="cart-product-title mb-1">
																	{item.title}
																</a>
															</Link>

															<div className="px-0 mt-2 d-flex justify-content-between align-items-center">
																<h6>
																	<strong>COLOR:</strong>
																</h6>
																<Form.Select
																	className="my-0"
																	size="sm"
																	value={color[index]}
																	onChange={(e) => {
																		let productColors = products
																			.find(
																				(product) =>
																					product.id === item.productId
																			)
																			.colors.split(",");

																		let selectedIndex =
																			e.target.options.selectedIndex;

																		let c = productColors[selectedIndex - 1];

																		setSelectedColor(c);

																		color[index] = c;
																		setColor(color);
																		editItemHandler(item.productId);
																	}}
																>
																	<option value="">Select Color</option>
																	{products
																		.find(
																			(product) => product.id === item.productId
																		)
																		.colors.split(",")
																		.map((c, i) => (
																			<option key={i} value={`${c}`}>
																				{c.toUpperCase()}
																			</option>
																		))}
																</Form.Select>
															</div>

															<div className="px-0 mt-2 d-flex justify-content-between align-items-center">
																<h6>
																	<strong>Size:</strong>
																</h6>
																<Form.Select
																	className="my-0"
																	size="sm"
																	value={size[index]}
																	onChange={(e) => {
																		let productSizes = products
																			.find(
																				(product) =>
																					product.id === item.productId
																			)
																			.sizes.split(",");

																		let selectedIndex =
																			e.target.options.selectedIndex;

																		let s = productSizes[selectedIndex - 1];

																		setSelectedSize(s);

																		size[index] = s;
																		setSize(size);
																		editItemHandler(item.productId);
																	}}
																>
																	<option value="">Select Size</option>
																	{products
																		.find(
																			(product) => product.id === item.productId
																		)
																		.sizes.split(",")
																		.map((s, i) => (
																			<option key={i} value={`${s}`}>
																				{s}
																			</option>
																		))}
																</Form.Select>
															</div>
														</Col>

														{item.discount !== 1 ? (
															<Col
																md={3}
																className="cart-price d-flex flex-row flex-wrap justify-content-between"
															>
																<OverlayTrigger
																	placement="top"
																	delay={{ show: 250, hide: 100 }}
																	overlay={renderTooltip}
																	onEnter={() =>
																		setToolTipText("Original Price")
																	}
																>
																	<p className="text-decoration-line-through">
																		${item.price}
																	</p>
																</OverlayTrigger>{" "}
																<OverlayTrigger
																	placement="top"
																	delay={{ show: 250, hide: 100 }}
																	overlay={renderTooltip}
																	onEnter={() =>
																		setToolTipText("Discount Price")
																	}
																>
																	<p>${item.price * item.discount}</p>
																</OverlayTrigger>
															</Col>
														) : (
															<Col
																md={2}
																className="cart-price d-flex flex-row flex-wrap justify-content-between"
															>
																<OverlayTrigger
																	placement="top"
																	delay={{ show: 250, hide: 100 }}
																	overlay={renderTooltip}
																	onEnter={() =>
																		setToolTipText("Original Price")
																	}
																>
																	<p>${item.price}</p>
																</OverlayTrigger>
																<OverlayTrigger
																	placement="top"
																	delay={{ show: 250, hide: 100 }}
																	overlay={renderTooltip}
																	onEnter={() =>
																		setToolTipText("Discount Price")
																	}
																>
																	<p>{""}</p>
																</OverlayTrigger>
															</Col>
														)}

														<Col md={4}>
															<Row className="d-flex">
																<Col className="mb-3 quantity-selector d-flex flex-row align-items-center justify-content-between">
																	<div
																		className="qty-btn decrease-btn"
																		onClick={() => {
																			editItemHandler(item.productId);
																			setOnDecrease(true);
																		}}
																	>
																		-
																	</div>
																	<div className="cart-quantity">
																		{item.qty}
																	</div>
																	<div
																		className="qty-btn increase-btn"
																		onClick={() => {
																			editItemHandler(item.productId);
																			setOnIncrease(true);
																		}}
																	>
																		+
																	</div>
																</Col>

																<Col className="d-flex justify-content-end">
																	<Button
																		type="button"
																		variant="dark"
																		className="cart-trash-btn"
																		onClick={() =>
																			removeFromCartHandler(item.productId)
																		}
																	>
																		<FontAwesomeIcon icon={faTrash} />
																	</Button>
																</Col>
															</Row>
														</Col>
													</Row>
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</Col>

						<Col md={4}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h3>
											Subtotal (
											{cart.reduce((acc, item) => acc + Number(item.qty), 0)})
											items
										</h3>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Total</strong>
											</Col>
											<Col>
												$
												{cart
													.reduce(
														(acc, item) =>
															acc + item.qty * item.price * item.discount,
														0
													)
													.toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item className="d-grid gap-2">
										<Button
											type="button"
											variant="dark"
											disabled={cart.length === 0}
											onClick={checkoutHandler}
										>
											{currentUser?.id
												? "Proceed To Chackout"
												: "Proceed To Sign In"}
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</Container>
			) : null}
		</>
	);
};

export default CartPage;
