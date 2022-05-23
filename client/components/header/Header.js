import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBasketShopping,
	faChevronRight,
	faListCheck,
	faRightFromBracket,
	faRightToBracket,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

import AccountDropDown from "./AccountDropDown";
import CategoryDropDown from "./CategoryDropDown";

const Header = ({ currentUser, products, bestseller }) => {
	const [eventTarget, setEventTarget] = useState(null);
	const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
	const [showAccountDropDown, setShowAccountDropDown] = useState(false);

	const [numItems, setNumItems] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const [onMobile, setOnMobile] = useState(true);

	const productCategories = ["Top", "Bottom", "Dress", "Set", "Coat"];

	useEffect(() => {
		// Update window innerWidth every 0.1 second
		const interval = setInterval(() => {
			// Initial retrieve data from localStorage
			const cartItems = localStorage.getItem("cartItems")
				? JSON.parse(localStorage.getItem("cartItems"))
				: [];

			if (cartItems.length !== 0) {
				setShowNotification(true);
				setNumItems(cartItems.length);
			} else if (cartItems.length === 0 || !cartItems) {
				setShowNotification(false);
				setNumItems(0);
			}

			if (window.innerWidth <= 992) {
				setOnMobile(true);
			} else {
				setOnMobile(false);
			}
		}, 100);

		return () => clearInterval(interval);
	}, [currentUser, onMobile]);

	return onMobile ? (
		<header>
			<Navbar variant="light" expand="lg" fixed="top" collapseOnSelect="true">
				<Container>
					<Navbar.Toggle aria-controls="offcanvasNavbar" />

					<Navbar.Offcanvas
						id="offcanvasNavbar"
						aria-labelledby="offcanvasNavbarLabel"
						placement="start"
					>
						<Offcanvas.Header closeButton>
							<Offcanvas.Title id="offcanvasNavbarLabel">
								<Link href="/" passHref>
									<Navbar.Brand className="header-logo text-uppercase">
										Aurapan
									</Navbar.Brand>
								</Link>
							</Offcanvas.Title>
						</Offcanvas.Header>

						<Offcanvas.Body className="d-flex flex-column justify-content-between ">
							<Nav className="offcanvas-body-upper d-flex flex-column justify-content-start">
								<Link href="/products/bestseller" passHref>
									<Nav.Link className="offcanvas-link">
										Bestseller <FontAwesomeIcon icon={faChevronRight} />
									</Nav.Link>
								</Link>

								{productCategories.map((category, index) => (
									<Link href={`/products/${category.toLowerCase()}${category === "Dress" ? "es" : "s"}`} key={index} passHref>
										<Nav.Link className="offcanvas-link">
											{category} <FontAwesomeIcon icon={faChevronRight} />
										</Nav.Link>
									</Link>
								))}
							</Nav>

							{currentUser ? (
								<Nav className="offcanvas-body-lower mb-2 d-flex flex-row justify-content-around">
									<Link href="/dashboard" passHref>
										<Nav.Link>
											<FontAwesomeIcon icon={faUser} /> Account
										</Nav.Link>
									</Link>
									{currentUser?.isAdmin && (
										<Link href="/admin" passHref>
											<Nav.Link>
												<FontAwesomeIcon icon={faListCheck} /> Management
											</Nav.Link>
										</Link>
									)}
									<Link href="/signout" passHref>
										<Nav.Link>
											<FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
										</Nav.Link>
									</Link>
								</Nav>
							) : (
								<Nav className="mx-3 d-flex flex-row justify-content-end ">
									<Link href="/signin" passHref>
										<Nav.Link>
											<FontAwesomeIcon icon={faRightToBracket} /> Sign In
										</Nav.Link>
									</Link>
								</Nav>
							)}
						</Offcanvas.Body>
					</Navbar.Offcanvas>

					<Link href="/" passHref>
						<Navbar.Brand className="header-logo text-uppercase">
							Aurapan
						</Navbar.Brand>
					</Link>

					<Nav className="icon-menu d-flex flex-row">
						<Link href="/cart" passHref>
							<Nav.Link className="position-relative cart-icon">
								<FontAwesomeIcon icon={faBasketShopping} /> Cart
								<span
									id="notification"
									className="position-absolute  badge border border-light rounded-circle bg-danger"
									style={{ display: showNotification ? "block" : "none" }}
								>
									<span className="visually-hidden">unread messages</span>
									{numItems}
								</span>
							</Nav.Link>
						</Link>
					</Nav>
				</Container>
			</Navbar>
		</header>
	) : (
		<header className="position-relative">
			<Navbar
				variant="light"
				expand="lg"
				fixed="top"
				collapseOnSelect="true"
				className="py-0"
			>
				<Container
					className="menu-container d-flex flex-row"
					onMouseLeave={() => setShowAccountDropDown(false)}
				>
					<Link href="/" passHref>
						<Navbar.Brand className="header-logo text-uppercase">
							Aurapan
						</Navbar.Brand>
					</Link>

					<Nav className="sub-menu">
						{productCategories.map((category, index) => (
							<Link href={`/products/${category.toLowerCase()}${category === "Dress" ? "es" : "s"}`} key={index} passHref>
								<Nav.Link
									onMouseEnter={(e) => {
										setEventTarget(e.target);
										setShowCategoryDropDown(true);
									}}
								>
									{category}
								</Nav.Link>
							</Link>
						))}
					</Nav>

					<CategoryDropDown
						eventTarget={eventTarget}
						showCategoryDropDown={showCategoryDropDown}
						setShowCategoryDropDown={setShowCategoryDropDown}
						products={products}
						bestseller={bestseller}
					/>

					<Nav className="icon-menu d-flex flex-row position-relative">
						<Link href="/cart" passHref>
							<Nav.Link className="cart-icon">
								<FontAwesomeIcon icon={faBasketShopping} /> Cart
								<span
									id="notification"
									className="position-absolute badge border border-light rounded-circle bg-danger"
									style={{ display: showNotification ? "block" : "none" }}
								>
									<span className="visually-hidden">unread messages</span>
									{numItems}
								</span>
							</Nav.Link>
						</Link>

						<Link href={currentUser ? "/dashboard" : "/signin"} passHref>
							<Nav.Link
								className="account-icon"
								onMouseEnter={() =>
									currentUser
										? setShowAccountDropDown(true)
										: setShowAccountDropDown(false)
								}
							>
								<FontAwesomeIcon icon={faCircleUser} /> Account
							</Nav.Link>
						</Link>

						<AccountDropDown
							currentUser={currentUser}
							showAccountDropDown={showAccountDropDown}
							setShowAccountDropDown={setShowAccountDropDown}
						/>
					</Nav>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
