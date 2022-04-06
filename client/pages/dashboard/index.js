import React, { useEffect, useState } from "react";
import { Row, Col, Container, Nav } from "react-bootstrap";
import dynamic from "next/dynamic";
import Router from "next/router";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBasketShopping,
  faCircleInfo,
  faHeart,
  faMapLocationDot,
  faShieldHalved,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import EditProfile from "../../components/EditProfile";
import EditSecurity from "../../components/EditSecurity";
import EditAddress from "../../components/EditAddress";
import UserOrderList from "../../components/UserOrderList";
import UserReviewList from "../../components/UserReviewList";
import WishList from "../../components/WishList";
import Support from "../../components/Support";

const DynamicTabContainer = dynamic(
  () => import("react-bootstrap/TabContainer"),
  {
    ssr: false,
  }
);
const DynamicTabContent = dynamic(() => import("react-bootstrap/TabContent"), {
  ssr: false,
});
const DynamicTabPane = dynamic(() => import("react-bootstrap/TabPane"), {
  ssr: false,
});

const Dashboard = ({ currentUser, users, myOrders, myReviews, products }) => {
  const [isReady, setIsReady] = useState(false);
  const user = users.find((user) => user.id === currentUser?.id);

  useEffect(() => {
    // Protect unauthorized access
    if (!currentUser) {
      return Router.push("/signin");
    } else {
      setIsReady(true);
    }
  }, []);

  return (
    isReady && (
      <>
        <Head>
          <title>Account Setting | Aurapan</title>
        </Head>

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
      </>
    )
  );
};

export default Dashboard;
