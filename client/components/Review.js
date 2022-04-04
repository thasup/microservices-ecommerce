import React, { useState } from "react";
import { Button, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalfAlt,
  faTrash,
  faStar as fasfaStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

import ReactStars from "react-rating-stars-component";
import useRequest from "../hooks/use-request";
import Loader from "./Loader";
import Message from "./Message";
import Rating from "./Rating";

const Review = ({ currentUser, product, users, isPurchase, onMobile }) => {
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { doRequest: addReview, errors: addReviewErrors } = useRequest({
    url: `/api/products/${product.id}/reviews`,
    method: "post",
    body: {
      title: reviewTitle,
      rating,
      comment,
    },
    onSuccess: () => {
      setLoading(false);
      Router.push(`/products/${product.id}`);
    },
  });

  const { doRequest: removeReview, errors: deleteReviewErrors } = useRequest({
    url: `/api/products/${product.id}/reviews`,
    method: "delete",
    body: {},
    onSuccess: () => {
      setLoading(false);
      Router.push(`/products/${product.id}`);
    },
  });

  const submitReviewHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    addReview();
  };

  const deleteReviewHandler = (review) => {
    if (currentUser && review.userId === currentUser?.id) {
      setLoading(true);
      removeReview();
    } else {
      alert("No authorized");
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 40}`;
  };

  return (
    <>
      <h3>Reviews</h3>
      {deleteReviewErrors}
      {product.reviews.length === 0 && !loading && (
        <Message variant="secondary">No Reviews</Message>
      )}
      <ListGroup variant="flush">
        {loading ? (
          <Loader />
        ) : (
          <>
            {product.reviews.map((review) => (
              <ListGroup.Item key={review.id}>
                <Row>
                  {users.find((user) => user.id === review.userId)?.image && (
                    <Col xs={2} className="profile-img">
                      <Image
                        loader={myLoader}
                        src={
                          users.find((user) => user.id === review.userId)?.image
                        }
                        alt="profile image"
                        width={200}
                        height={200}
                        layout="responsive"
                      />
                    </Col>
                  )}

                  <Col xs={10}>
                    <p className="review-name">
                      {users.find((user) => user.id === review.userId).name}
                    </p>
                    <div className="d-flex flex-row align-items-center mb-3">
                      <Rating
                        value={review.rating}
                        mobile={onMobile ? true : false}
                      />
                      <div className="ms-3">
                        {review.createdAt.substring(0, 10)}
                      </div>
                    </div>

                    <p className="review-title">{review.title}</p>
                    <p className="review-comment">{review.comment}</p>
                  </Col>

                  {review.userId === currentUser?.id && (
                    <Col className="trash-btn">
                      <button
                        type="button"
                        className="btn-sm mx-1 btn btn-dark"
                        onClick={() => deleteReviewHandler(review)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Col>
                  )}
                </Row>
              </ListGroup.Item>
            ))}
          </>
        )}

        {currentUser ? (
          <>
            {!product.reviews.some(
              (review) => review.userId === currentUser?.id
            ) && isPurchase ? (
              <ListGroup className="mt-3">
                <h3>Write a Review</h3>

                <Form onSubmit={submitReviewHandler}>
                  <Form.Group className="my-3">
                    <Form.Label>Rating</Form.Label>
                    <ReactStars
                      count={5}
                      size={40}
                      isHalf={true}
                      emptyIcon={<FontAwesomeIcon icon={faStar} />}
                      halfIcon={<FontAwesomeIcon icon={faStarHalfAlt} />}
                      fullIcon={<FontAwesomeIcon icon={fasfaStar} />}
                      activeColor="#000"
                      value={rating}
                      onChange={(newValue) => setRating(newValue)}
                    />
                  </Form.Group>

                  <Form.Group controlId="reviewTitle" className="my-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter review title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="comment" className="my-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      className="text-area"
                      placeholder="Write a review"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  {addReviewErrors}
                  <Button type="submit" variant="dark" className="mt-3">
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
                    ) : null}{" "}
                    Submit
                  </Button>
                </Form>
              </ListGroup>
            ) : !product.reviews.some(
                (review) => review.userId === currentUser?.id
              ) && !isPurchase ? (
              <Message variant="secondary">
                You must purchase the product to write a review
              </Message>
            ) : null}
          </>
        ) : (
          <Message variant="secondary">
            Please{" "}
            <Link href="/signin">
              <a>sign in</a>
            </Link>{" "}
            to write a review
          </Message>
        )}
      </ListGroup>
    </>
  );
};

export default Review;
