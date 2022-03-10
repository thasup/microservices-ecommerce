import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "./CustomTooltip";

const ProductList = ({ products }) => {
  const deleteHandler = async (id) => {
    setLoading(true);
    await axios.delete(`/api/products/${id}`);
    setLoading(false);
  };

  return (
    <Row className="align-items-center">
      <Col>
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
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <CustomTooltip index={index} mongoId={product.id} />
                </td>
                <td>
                  <Link
                    href={`/products/[productId]`}
                    as={`/products/${product.id}`}
                  >
                    <a>{product.title}</a>
                  </Link>
                </td>
                <td>{product.countInStock}</td>
                <td>${product.price}</td>
                <td>{product.colors}</td>
                <td>{product.sizes}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.material}</td>
                <td className="d-flex justify-content-center">
                  <Link href={`/admin/product-edit`} passHref>
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
      </Col>
    </Row>
  );
};

export default ProductList;
