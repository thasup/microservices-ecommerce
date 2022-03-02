import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Loader from "../../components/Loader";
import Rating from "../../components/Rating";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const productDetail = ({ products, currentUser }) => {
  const router = useRouter();
  const { productId } = router.query;

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      productId,
    },
    onSuccess: (order) => console.log(order),
    // Router.push("/"),
  });

  const product = products.find((product) => product.id === productId);

  console.log(product);
  console.log(productId);

  const addToCartHandler = () => {
    doRequest();
    // router.push(`/cart/${product.id}?qty=${qty}`);
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
    return `https://www.dropbox.com/${src}?raw=1&w=${width}&q=${quality || 75}`;
  };

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
            <Col md={6} className="mb-3">
              <Image
                loader={myLoader}
                src={product.image}
                width={400}
                height={400}
                layout="responsive"
                objectFit="contain"
                alt={product.title}
              />
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
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
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
