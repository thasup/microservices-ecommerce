'use client';

import { useRef, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

import apiClient from '../../lib/api-client';
import AccountDropDown from './AccountDropDown';
import CategoryDropDown from './CategoryDropDown';

const DesktopNavbar = ({
  currentUser,
  numItems,
  showNotification,
  productCategories
}) => {
  const [eventTarget, setEventTarget] = useState(null);
  const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
  const [showAccountDropDown, setShowAccountDropDown] = useState(false);

  // Lazily fetched data for the category fly-out menu
  const [products, setProducts] = useState([]);
  const [bestseller, setBestseller] = useState([]);
  const menuDataRequested = useRef(false);

  const ensureMenuData = () => {
    if (menuDataRequested.current) return;
    menuDataRequested.current = true;

    Promise.all([
      apiClient.get('/api/products'),
      apiClient.get('/api/products/bestseller')
    ])
      .then(([productsRes, bestsellerRes]) => {
        setProducts(productsRes.data ?? []);
        setBestseller(bestsellerRes.data ?? []);
      })
      .catch(() => {
        menuDataRequested.current = false;
      });
  };

  return (
    <header>
      <Navbar variant="light" expand="lg" collapseOnSelect className="py-0">
        <Container
          className="menu-container d-flex flex-row"
          onMouseLeave={() => setShowAccountDropDown(false)}
        >
          <Navbar.Brand as={Link} href="/" className="header-logo text-uppercase">
            Aurapan
          </Navbar.Brand>

          <Nav
            className="sub-menu"
            onMouseLeave={() => setShowCategoryDropDown(false)}
          >
            {productCategories.map((category, index) => (
              <Nav.Link
                as={Link}
                href={`/products/${category.toLowerCase()}${
                  category === 'Dress' ? 'es' : 's'
                }`}
                key={index}
                onMouseEnter={(e) => {
                  ensureMenuData();
                  setEventTarget(e.target);
                  setShowCategoryDropDown(true);
                }}
              >
                {category}
              </Nav.Link>
            ))}
          </Nav>

          <Nav className="icon-menu d-flex flex-row position-relative">
            <Nav.Link as={Link} href="/cart" className="cart-icon">
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

            <Nav.Link
              as={Link}
              href={currentUser ? '/dashboard' : '/signin'}
              className="account-icon"
              onMouseEnter={() =>
                currentUser
                  ? setShowAccountDropDown(true)
                  : setShowAccountDropDown(false)
              }
            >
              <FontAwesomeIcon icon={faCircleUser} /> Account
            </Nav.Link>

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
