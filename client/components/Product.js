import React from "react";
import Link from "next/link";
import { Card } from "react-bootstrap";

import Rating from "./Rating";
import Image from "next/image";

const Product = ({ product }) => {
  const myLoader = ({ src, width, quality }) => {
    return `https://www.dropbox.com/${src}?raw=1&w=${width}&q=${quality || 75}`;
  };

  return (
    <Card className="mb-3 product-card">
      <Link href={`/products/[productId]`} as={`/products/${product.id}`}>
        <div className="product-img">
          <Card.Body className="product-img__cover">
            <Image
              loader={myLoader}
              src={product.image}
              width={475}
              height={475}
              layout="fill"
              objectFit="cover"
              alt={`${product.title} image 1`}
            />
          </Card.Body>
          <Card.Body className="product-img__hover">
            <Image
              loader={myLoader}
              src={"s/4ojq7yz8ksrpln7/1050f24bf8dcd22c28fd9f15274765ce.jpg"}
              width={475}
              height={475}
              layout="fill"
              objectFit="cover"
              alt={`${product.title} image 2`}
            />
          </Card.Body>
        </div>
      </Link>

      <Card.Body className="px-2">
        <div className="d-flex flex-row justify-content-between">
          <Card.Title className="card-product-title" as="h4">
            <Link href={`/products/[productId]`} as={`/products/${product.id}`}>
              <a className="text-uppercase">{product.title}</a>
            </Link>
          </Card.Title>

          <Card.Text className="card-product-price" as="h4">
            ${product.price}
          </Card.Text>
        </div>

        <Card.Text className="card-product-reviews" as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} Reviews`}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
