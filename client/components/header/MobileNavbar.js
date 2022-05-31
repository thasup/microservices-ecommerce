import React from "react";
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

const MobileNavbar = ({
	currentUser,
	numItems,
	showNotification,
	productCategories,
}) => {
	return (
		<header>
			<Navbar variant="light" expand="lg" collapseOnSelect="true">
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
									<Link
										href={`/products/${category.toLowerCase()}${
											category === "Dress" ? "es" : "s"
										}`}
										key={index}
										passHref
									>
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
	);
};

export default MobileNavbar;
