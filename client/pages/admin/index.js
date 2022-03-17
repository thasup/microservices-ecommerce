import React from "react";
import dynamic from "next/dynamic";
import { Col, Container, Nav, Row } from "react-bootstrap";

import buildClient from "../../api/build-client";
import CreateProduct from "../../components/CreateProduct";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";
import ProductList from "../../components/ProductList";

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

const AdminDashboard = ({ products, users, orders }) => {
  return (
    <Container className="app-container admin-dashboard">
      <h1>Admin Dashboard</h1>
      <DynamicTabContainer
        variant="light"
        defaultActiveKey="product-list"
        forceRenderTabPanel={true}
      >
        <Row>
          <Col md={2} className="mb-5">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="product-list">
                  <i className="fa-solid fa-shirt"></i> Product List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="user-list">
                  <i className="far fa-user"></i> User List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order-list">
                  <i className="fa-solid fa-basket-shopping"></i> Order List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create-product">
                  <i className="fa-solid fa-plus"></i> New Product
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={10}>
            <DynamicTabContent>
              <DynamicTabPane eventKey="product-list">
                <ProductList products={products} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="user-list">
                <UserList users={users} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="order-list">
                <OrderList orders={orders} users={users} />
              </DynamicTabPane>

              <DynamicTabPane eventKey="create-product">
                <CreateProduct />
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
  let { data } = await client.get("/api/users/currentuser");

  // Redirect to signin page or home if user do not authorized
  if (data.currentUser?.isAdmin) {
    let { data: productData } = await client
      .get("/api/products")
      .catch((err) => {
        console.log(err.message);
      });
    let { data: userData } = await client.get("/api/users").catch((err) => {
      console.log(err.message);
    });
    let { data: orderData } = await client.get("/api/orders").catch((err) => {
      console.log(err.message);
    });

    if (productData === (null || undefined)) {
      return (productData = []);
    } else if (userData === (null || undefined)) {
      return (userData = []);
    } else if (orderData === (null || undefined)) {
      return (orderData = []);
    }

    return {
      props: { products: productData, users: userData, orders: orderData },
    };
  } else if (data.currentUser?.isAdmin === false) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}

export default AdminDashboard;
