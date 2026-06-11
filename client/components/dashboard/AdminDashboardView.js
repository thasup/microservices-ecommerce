'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faPlus,
  faShirt
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import CreateProduct from './CreateProduct';
import UserList from './UserList';
import OrderList from './OrderList';
import ProductList from './ProductList';

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

const AdminDashboardView = ({
  products,
  users,
  orders,
  orderProducts,
  paymentProducts
}) => {
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
                  <FontAwesomeIcon icon={faShirt} /> Product List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="user-list">
                  <FontAwesomeIcon icon={faUser} /> User List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order-list">
                  <FontAwesomeIcon icon={faBasketShopping} /> Order List
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create-product">
                  <FontAwesomeIcon icon={faPlus} /> New Product
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
  );
};

export default AdminDashboardView;
