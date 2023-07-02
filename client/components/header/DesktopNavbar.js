import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

import AccountDropDown from './AccountDropDown';
import CategoryDropDown from './CategoryDropDown';
import { UserContext } from '../../contexts/UserContext';

const DesktopNavbar = (props) => {
	const {
		products,
		bestseller,
		numItems,
		showNotification,
		productCategories
	} = props;

  const [eventTarget, setEventTarget] = useState(null);
  const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
  const [showAccountDropDown, setShowAccountDropDown] = useState(false);
	const currentUser = useContext(UserContext);

  return (
		<header>
			<Navbar
				variant="light"
				expand="lg"
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

					<Nav
						className="sub-menu"
						onMouseLeave={() => setShowCategoryDropDown(false)}
					>
						{productCategories.map((category, index) => (
							<Link
								href={`/products/${category.toLowerCase()}${
									category === 'Dress' ? 'es' : 's'
								}`}
								key={index}
								passHref
							>
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

					<Nav className="icon-menu d-flex flex-row position-relative">
						<Link href="/cart" passHref>
							<Nav.Link className="cart-icon">
								<FontAwesomeIcon icon={faBasketShopping} /> Cart
								<span
									id="notification"
									className="position-absolute badge border border-light rounded-circle bg-danger"
									style={{ display: showNotification ? 'block' : 'none' }}
								>
									<span className="visually-hidden">unread messages</span>
									{numItems}
								</span>
							</Nav.Link>
						</Link>

						<Link href={currentUser ? '/dashboard' : '/signin'} passHref>
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

			<CategoryDropDown
				eventTarget={eventTarget}
				showCategoryDropDown={showCategoryDropDown}
				setShowCategoryDropDown={setShowCategoryDropDown}
				products={products}
				bestseller={bestseller}
			/>
		</header>
  );
};

export default DesktopNavbar;
