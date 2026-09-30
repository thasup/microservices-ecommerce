'use client';

import React from 'react';
import { Row, Col, Container, Nav } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faBasketShopping,
  faCircleInfo,
  faHeart,
  faMapLocationDot,
  faShieldHalved,
  faStar
} from '@fortawesome/free-solid-svg-icons';

import EditProfile from './EditProfile';
import EditSecurity from './EditSecurity';
import EditAddress from './EditAddress';
import UserOrderList from './UserOrderList';
import UserReviewList from './UserReviewList';
import WishList from './WishList';
import Support from './Support';

const DynamicTabContainer = dynamic(
  () => import('react-bootstrap/TabContainer'),
  {
    ssr: false
  }
);
const DynamicTabContent = dynamic(() => import('react-bootstrap/TabContent'), {
  ssr: false
});
const DynamicTabPane = dynamic(() => import('react-bootstrap/TabPane'), {
  ssr: false
});

const DashboardView = ({ currentUser, users, myOrders, myReviews, products }) => {
  const user = users.find((user) => user.id === currentUser?.id) ?? currentUser;

  return (
    <Container className="app-container admin-dashboard">
      <h1>Account Setting</h1>

      <DynamicTabContainer
        variant="light"
        defaultActiveKey="profile"
        forceRenderTabPanel={true}
      >
        <Row>
          <Col md={2} className="mb-5">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FontAwesomeIcon icon={faShieldHalved} /> Security
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="address">
                  <FontAwesomeIcon icon={faMapLocationDot} /> Address
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="orders">
                  <FontAwesomeIcon icon={faBasketShopping} /> Orders
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="reviews">
                  <FontAwesomeIcon icon={faStar} /> Reviews
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="wishlist">
                  <FontAwesomeIcon icon={faHeart} /> Wishlist
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="support">
                  <FontAwesomeIcon icon={faCircleInfo} /> Support
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={10}>
            <DynamicTabContent>
              <DynamicTabPane eventKey="profile">
                <EditProfile user={user} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="security">
                <EditSecurity user={user} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="address">
                <EditAddress user={user} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="orders">
                <UserOrderList myOrders={myOrders} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="reviews">
                <UserReviewList myReviews={myReviews} products={products} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="wishlist">
                <WishList products={products} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="support">
                <Support user={user} />
              </DynamicTabPane>
            </DynamicTabContent>
          </Col>
        </Row>
      </DynamicTabContainer>
    </Container>
  );
};

export default DashboardView;
