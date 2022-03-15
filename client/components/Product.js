import React, { useState } from "react";
import Link from "next/link";
import { Card, Col, Row } from "react-bootstrap";

import Rating from "./Rating";
import Image from "next/image";
import AddToCart from "./AddToCart";
import ColorSelector from "./ColorSelector";

const Product = ({ product, currentUser }) => {
  const [color, setColor] = useState(null);

  const colorSelectedHandler = (color) => {
    if (color !== null) {
      setColor(color);
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 20}`;
  };

  return (
    <Card className="mb-3 product-card">
      <div className="product-img">
        <Link
          href={`/products/[productId]`}
          as={`/products/${product.id}`}
          passHref
        >
          <Card.Body className="product-img__cover">
            <Image
              loader={myLoader}
              src={product.images.image1 || product.image}
              layout="fill"
              objectFit="cover"
              alt={`${product.title} image 1`}
            />
          </Card.Body>
        </Link>

        <Link
          href={`/products/[productId]`}
          as={`/products/${product.id}`}
          passHref
        >
          <Card.Body className="product-img__hover">
            <Image
              loader={myLoader}
              src={product.images.image2}
              layout="fill"
              objectFit="cover"
              alt={`${product.title} image 2`}
            />
          </Card.Body>
        </Link>

        <div className="menu-tab">
          <AddToCart
            product={product}
            currentUser={currentUser}
            color={color}
          />
        </div>
      </div>

      <Card.Body className="px-2">
        <Row className="d-flex flex-row justify-content-between ">
          <Col xs={12} sm={9} as="h4">
            <Link
              href={`/products/[productId]`}
              as={`/products/${product.id}`}
              passHref
            >
              <a className="card-product-title">{product.title}</a>
            </Link>
          </Col>

          <Col xs={12} sm={3}>
            <h4 className="card-product-price">${product.price}</h4>
          </Col>
        </Row>

        <Row className="d-flex flex-row justify-content-end">
          <Col xs={12} sm={5} className="card-product-reviews" as="div">
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </Col>

          <Col xs={12} sm={7} className="card-product-color" as="div">
            <ColorSelector
              product={product}
              callback={colorSelectedHandler}
              margin={"0px"}
              size={"1.5rem"}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Product;
