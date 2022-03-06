import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Loader from "../../components/Loader";
import Rating from "../../components/Rating";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const productDetail = ({ products, currentUser }) => {
  const { productId } = useRouter().query;

  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponError, setCouponError] = useState(false);

  // const { doRequest, errors } = useRequest({
  //   url: "/api/orders",
  //   method: "post",
  //   body: {
  //     productId,
  //   },
  //   onSuccess: (order) => console.log(order),
  //   // Router.push("/"),
  // });

  const { doRequest, errors } = useRequest({
    url: `/api/orders/${productId}/cart`,
    method: "post",
    body: {
      qty,
      discount,
    },
    onSuccess: () => Router.push("/cart"),
  });

  // useEffect(
  //   (e) => {
  //     applyCoupon(e);
  //   },
  //   [couponSuccess, couponError]
  // );

  const product = products.find((product) => product.id === productId);
  console.log(product);

  const applyCoupon = (e) => {
    e.preventDefault();

    if (
      discount === "FREE" ||
      discount === "GRANDSALE" ||
      discount === "HOTDEAL"
    ) {
      setCouponSuccess(true);
      setCouponError(false);
    } else {
      setCouponSuccess(false);
      setCouponError(true);
    }
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    doRequest();
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
  };

  const deleteReviewHandler = (review) => {
    if (currentUser && review.userId === currentUser.id) {
    } else {
      alert("Not allow");
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `https://www.dropbox.com/s/${src}?raw=1&w=${width}&q=${
      quality || 75
    }`;
  };

  console.log(Object.values(product.images));

  let allImages = [];
  for (const img in product.images) {
    if (product.images[img] !== "" && typeof product.images[img] === "string") {
      allImages.push(product.images[img]);
    }
  }

  return (
    <div className="px-5">
      <Link href="/" passHref>
        <a className="btn btn-outline-dark mb-3">Back</a>
      </Link>
      {!product.id || product.id !== productId ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col md={1} className="mb-3">
              {allImages.map((img, index) => (
                <div className="product-img-side" key={index}>
                  <Image
                    loader={myLoader}
                    src={img}
                    // width={400}
                    // height={400}
                    // priority="true"
                    layout="fill"
                    objectFit="cover"
                    alt={`product_image_${index}`}
                  />
                </div>
              ))}
            </Col>

            <Col md={5} className="mb-3">
              <div className="product-img-main">
                <Image
                  loader={myLoader}
                  src={product.images.image1}
                  // width={400}
                  // height={400}
                  // priority="true"
                  layout="fill"
                  objectFit="cover"
                  alt={product.title}
                />
              </div>
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.title}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  <div className="my-2">Description:</div>
                  <div>{product.description}</div>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <>
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty:</Col>
                          <Col>
                            <Form.Control
                              className="form-select"
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (obj) => (
                                  <option key={obj + 1} value={obj + 1}>
                                    {obj + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row className="px-3">
                          {couponError && (
                            <div className="px-0 py-2" style={{ color: "red" }}>
                              {
                                "The coupon code entered is not valid for this product"
                              }
                            </div>
                          )}
                          {couponSuccess ? (
                            <div className="px-0 py-2">{`${discount} is applied`}</div>
                          ) : (
                            <>
                              <Form.Control
                                className="coupon-text text-uppercase"
                                type="text"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                              ></Form.Control>
                              <Button
                                className="coupon-button"
                                onClick={applyCoupon}
                                type="button"
                                variant="dark"
                                placeholder="Enter Coupon"
                              >
                                Apply
                              </Button>
                            </>
                          )}
                        </Row>
                      </ListGroup.Item>
                    </>
                  )}

                  {errors}
                  <ListGroup.Item className="d-grid">
                    <Button
                      onClick={addToCartHandler}
                      type="button"
                      variant="dark"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* {errorDeleteProductReview && (
            <Message variant="danger">{errorDeleteProductReview}</Message>
          )} */}
          <Row className="mt-3 pb-5">
            <Col md={6}>
              {loading && <Loader />}
              <h2>Reviews</h2>
              {product.reviews.length === 0 && (
                <Message variant="secondary">No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <Row className="">
                      <Col>
                        <strong>{review.title}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </Col>
                      {review.userId === currentUser?.id && (
                        <Col className="col-1 justify-content-end">
                          <button
                            type="button"
                            class="btn-sm mx-1 btn btn-danger"
                            onClick={() => deleteReviewHandler(review)}
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </Col>
                      )}
                    </Row>
                  </ListGroup.Item>
                ))}
                {currentUser ? (
                  <>
                    {!product.reviews.some(
                      (review) => review.userId === currentUser?.id
                    ) && (
                      <ListGroup className="mt-3">
                        <h2>Write a Review</h2>
                        {/* {errorProductReview && (
                          <Message variant="danger">
                            {errorProductReview}
                          </Message>
                        )} */}
                        <Form onSubmit={submitReviewHandler}>
                          <Form.Group className="my-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              as="select"
                              id="form-select-rating"
                              className="form-select"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value="">Select...</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="comment" className="my-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              row="3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button type="submit" variant="dark">
                            Submit
                          </Button>
                        </Form>
                      </ListGroup>
                    )}
                  </>
                ) : (
                  <Message>
                    Please <Link href="/login">sign in</Link> to write a review
                  </Message>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products");

  return { props: { products: data } };
}

export default productDetail;
