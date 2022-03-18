import Link from "next/link";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import ColorSelector from "./ColorSelector";
import CustomTooltip from "./CustomTooltip";
import SizeSelector from "./SizeSelector";

const WishList = ({ products }) => {
  return (
    <Row className="align-items-center">
      <Col>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default WishList;
