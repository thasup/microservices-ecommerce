import React from "react";
import dynamic from "next/dynamic";
import { Col, Container, Nav, Row } from "react-bootstrap";
import Head from "next/head";

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

const AdminDashboard = ({
  products,
  users,
  orders,
  orderProducts,
  paymentProducts,
}) => {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Aurapan</title>
      </Head>
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
                  <ProductList
                    products={products}
                    orderProducts={orderProducts}
                    paymentProducts={paymentProducts}
                  />
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
    </>
  );
};

export default AdminDashboard;
