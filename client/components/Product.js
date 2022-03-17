import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import Rating from "./Rating";
import AddToCart from "./AddToCart";
import ColorSelector from "./ColorSelector";

const Product = ({ product, currentUser }) => {
  const [color, setColor] = useState(null);
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth <= 576) {
        setOnMobile(true);
      } else {
        setOnMobile(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
              src={product.images.image1}
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
        <Row className="d-flex flex-row justify-content-between px-0 mx-0">
          <Col xs={12} sm={9} className="card-product-title" as="h4">
            <Link
              href={`/products/[productId]`}
              as={`/products/${product.id}`}
              passHref
            >
              <a>{product.title}</a>
            </Link>
          </Col>

          <Col xs={12} sm={3} className="card-product-price">
            <h4 style={{ textAlign: onMobile ? "start" : "end" }}>
              ${product.price}
            </h4>
          </Col>
        </Row>

        <Row className="d-flex flex-row justify-content-end align-items-center px-0 mx-0">
          <Col xs={5} className="card-product-reviews" as="div">
            <Rating
              value={product.rating}
              text={`(${product.numReviews})`}
              mobile={true}
            />
          </Col>

          <Col xs={7} className="card-product-color" as="div">
            <ColorSelector
              product={product}
              callback={colorSelectedHandler}
              margin={"2px"}
              size={onMobile ? "15px" : "25px"}
              flex={"end"}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Product;
