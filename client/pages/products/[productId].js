import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";

import Loader from "../../components/Loader";
import Rating from "../../components/Rating";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import NextImage from "../../components/NextImage";

const productDetail = ({ products, currentUser }) => {
  const { productId } = useRouter().query;

  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [initialSetImage, setInitialSetImage] = useState(false);
  const [addToCart, setAddToCart] = useState(false);

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

  useEffect(() => {
    if (initialSetImage === false) {
      const mainImage = document.getElementsByClassName("product-main-img");
      mainImage[0].classList.add("toggle-main-img");
      setInitialSetImage(true);
    }

    const item = {
      userId: currentUser.id,
      title: product.title,
      qty: Number(qty),
      image: product.images.image1,
      price: product.price,
      countInStock: product.countInStock,
      discount: discount || 1,
      productId: productId,
    };
    console.log("item", item);

    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    if (addToCart) {
      console.log("initial storage cartItems:", cartItems);

      const existItem = cartItems.find((x) => x.productId === item.productId);

      if (existItem) {
        cartItems = cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        cartItems.push(item);
        console.log("push!!", cartItems);
      }

      console.log("final storage cartItems:", cartItems);

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setAddToCart(false);
    }
  }, [addToCart]);

  const product = products.find((product) => product.id === productId);

  const applyCoupon = (e) => {
    e.preventDefault();

    switch (discount) {
      case "FREE":
        setDiscount(0);
        break;
      case "GRANDSALE":
        setDiscount(0.5);
        break;
      case "HOTDEAL":
        setDiscount(0.75);
        break;
      default:
        setDiscount(1);
    }

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

  // const eveluateCoupon = (discount) => {
  //   // Evaluate discount factor

  //   return discountFactor;
  // };

  const addToCartHandler = (e) => {
    e.preventDefault();
    setAddToCart(true);
    // doRequest();
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

  let allImages = [];
  for (const img in product.images) {
    if (product.images[img] !== "" && typeof product.images[img] === "string") {
      allImages.push(product.images[img]);
    }
  }

  const imageHandler = (e) => {
    e.preventDefault();
    const mainImage = document.getElementsByClassName("product-main-img");
    const sideImage = document.getElementsByClassName("product-side-img");

    for (let i = 0; i < mainImage.length; i++) {
      mainImage[i].classList.remove("toggle-main-img");
    }

    const currentId = e.target.parentElement.parentElement.id.slice(-1);

    mainImage[currentId].classList.add("toggle-main-img");

    for (let i = 0; i < sideImage.length; i++) {
      sideImage[i].classList.remove("toggle-side-img");
    }

    e.target.parentElement.parentElement.classList.add("toggle-side-img");
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
            <Col md={1} className="mb-3">
              {allImages.map((img, index) => (
                <div
                  className="product-side-img"
                  id={`side-img-${index}`}
                  key={index}
                  onClick={imageHandler}
                >
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={50}
                  />
                </div>
              ))}
            </Col>

            <Col md={5} className="mb-3 position-relative">
              {allImages.map((img, index) => (
                <div className="product-main-img" key={index}>
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={100}
                  />
                </div>
              ))}
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
