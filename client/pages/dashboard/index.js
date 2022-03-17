import React from "react";
import { Row, Col, Container, Nav } from "react-bootstrap";
import dynamic from "next/dynamic";

import buildClient from "../../api/build-client";
import EditProfile from "../../components/EditProfile";
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

const Dashboard = ({ currentUser, users, orders, products }) => {
  const user = users.find((user) => user.id === currentUser?.id);

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
                  <i class="far fa-user"></i> Profile
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="address">
                  <i class="fas fa-map-location-dot"></i> Address
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="orders">
                  <i class="fas fa-basket-shopping"></i> Orders
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="wishlist">
                  <i class="fas fa-heart"></i> Wishlist
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="support">
                  <i class="fas fa-circle-info"></i> Support
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={10}>
            <DynamicTabContent>
              <DynamicTabPane eventKey="profile">
                <EditProfile user={user} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="address">
                <EditAddress user={user} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="orders">
                <UserOrderList orders={orders} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="wishlist">
                <WishList products={products} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="support">
                <Support />
              </DynamicTabPane>
            </DynamicTabContent>
          </Col>
        </Row>
      </DynamicTabContainer>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  // Redirect to signin page if user do not authorized
  if (data.currentUser === null) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  } else {
    let { data: userData } = await client.get("/api/users").catch((err) => {
      console.log(err.message);
    });
    let { data: orderData } = await client
      .get("/api/orders/myorders")
      .catch((err) => {
        console.log(err.message);
      });
    let { data: productData } = await client
      .get("/api/products")
      .catch((err) => {
        console.log(err.message);
      });

    if (userData === (null || undefined)) {
      return (userData = []);
    }
    if (orderData === (null || undefined)) {
      return (orderData = []);
    }
    if (productData === (null || undefined)) {
      return (productData = []);
    }

    return {
      props: { users: userData, orders: orderData, products: productData },
    };
  }
}

export default Dashboard;
