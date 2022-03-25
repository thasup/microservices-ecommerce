import React from "react";
import { Row, Col, Container, Nav } from "react-bootstrap";
import dynamic from "next/dynamic";
import Head from "next/head";

import EditProfile from "../../components/EditProfile";
import EditSecurity from "../../components/EditSecurity";
import EditAddress from "../../components/EditAddress";
import UserOrderList from "../../components/UserOrderList";
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

const Dashboard = ({ currentUser, users, myOrders, products }) => {
  const user = users.find((user) => user.id === currentUser?.id);

  return (
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
                    <i className="far fa-user"></i> Profile
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="security">
                    <i className="fas fa-shield-halved"></i> Security
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="address">
                    <i className="fas fa-map-location-dot"></i> Address
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="orders">
                    <i className="fas fa-basket-shopping"></i> Orders
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="wishlist">
                    <i className="fas fa-heart"></i> Wishlist
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="support">
                    <i className="fas fa-circle-info"></i> Support
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
  );
};

export default Dashboard;
