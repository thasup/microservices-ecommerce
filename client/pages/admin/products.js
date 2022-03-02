import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import buildClient from "../../api/build-client";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useRequest from "../../hooks/use-request";

const products = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      Router.push("/signin");
    }
  }, []);

  const deleteHandler = async (id) => {
    setLoading(true);
    await axios.delete(`/api/products/${id}`);
    setLoading(false);
  };

  const createProductHandler = () => {
    Router.push("/admin/create");
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="my-3"
            variant="dark"
            onClick={createProductHandler}
          >
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {/* {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>} */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>COLOR</th>
                <th>SIZE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>MATERIAL</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.countInStock}</td>
                  <td>${product.price}</td>
                  <td>{product.colors}</td>
                  <td>{product.sizes}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.material}</td>
                  <td className="d-flex justify-content-center">
                    <Link href={`/admin/product-edit/${product.id}`} passHref>
                      <Button variant="dark" className="btn-sm mx-1">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm mx-1"
                      onClick={() => deleteHandler(product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products");

  return { props: { products: data } };
}

export default products;
