import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Nav, Row, Tab, Table } from "react-bootstrap";

import buildClient from "../../api/build-client";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useRequest from "../../hooks/use-request";
import CreateProduct from "../../components/CreateProduct";
import ProductList from "../../components/ProductList";
import UserList from "../../components/UserList";
import OrderList from "../../components/OrderList";

const AdminDashboard = ({ products, users, orders, currentUser }) => {
  // const [loading, setLoading] = useState(false);

  console.log("products", products);
  console.log("users", users);
  console.log("orders", orders);

  // useEffect(() => {
  //   if (!currentUser || !currentUser.isAdmin) {
  //     Router.push("/signin");
  //   }
  // }, []);

  // const deleteHandler = async (id) => {
  //   setLoading(true);
  //   await axios.delete(`/api/products/${id}`);
  //   setLoading(false);
  // };

  // const createProductHandler = (e) => {
  //   e.preventDefault();
  //   Router.push("/admin/create-product");
  // };

  return (
    <Container className="app-container admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Tab.Container variant="light" defaultActiveKey="product-list">
        <Row>
          <Col sm={2}>
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
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="product-list">
                <ProductList products={products} />
              </Tab.Pane>
              <Tab.Pane eventKey="user-list">
                <UserList users={users} />
              </Tab.Pane>
              <Tab.Pane eventKey="order-list">
                <OrderList orders={orders} />
              </Tab.Pane>
              <Tab.Pane eventKey="create-product">
                <CreateProduct />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data: productData } = await client.get("/api/products");
  const { data: userData } = await client.get("/api/users");
  const { data: orderData } = await client.get("/api/orders");

  return {
    props: { products: productData, users: userData, orders: orderData },
  };
}

export default AdminDashboard;
