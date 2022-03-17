import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";

import useRequest from "../hooks/use-request";
import ColorSelector from "./ColorSelector";
import CustomTooltip from "./CustomTooltip";
import SizeSelector from "./SizeSelector";

const ProductList = ({ products }) => {
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/products/${deleteProductId}`,
    method: "delete",
    body: {},
    onSuccess: () => {
      setLoading(false);
      Router.push("/admin");
    },
  });

  useEffect(() => {
    if (loading) {
      if (window.confirm("Are you sure?")) {
        doRequest();
      }
    }
  }, [loading]);

  const deleteHandler = (id) => {
    setDeleteProductId(id);
    setLoading(true);
  };

  return (
    <Row className="align-items-center">
      <Col>
        {errors}
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>QTY</th>
              <th>PRICE</th>
              <th>COLOR</th>
              <th>SIZE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>MATERIAL</th>
              <th>REVIEW</th>
              <th>VER.</th>
              <th>DETAILS</th>
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
                <td>
                  <ColorSelector
                    product={product}
                    margin={"2px"}
                    size={"1.5rem"}
                    flex={"start"}
                  />
                </td>
                <td>
                  <SizeSelector product={product} width={"1.2rem"} />
                </td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.material}</td>
                <td>{product.numReviews}</td>
                <td>{product.version}</td>
                <td>
                  <Link
                    href={`/products/edit/[productId]`}
                    as={`/products/edit/${product.id}`}
                    passHref
                  >
                    <Button variant="dark" className="btn-sm mx-1">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm mx-1"
                    onClick={() => deleteHandler(product.id)}
                  >
                    {loading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        as="span"
                        size="sm"
                        aria-hidden="true"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
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
