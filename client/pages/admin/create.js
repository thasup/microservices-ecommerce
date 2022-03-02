import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";

import FormContainer from "../../components/FormContainer";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import useRequest from "../../hooks/use-request";
import useAuthorized from "../../hooks/use-authorization";

const create = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [loading, setLoading] = useState(false);

  // const { doAuthorized } = useAuthorized({
  //   currentUser: currentUser,
  //   onSuccess: () => Router.push("/"),
  // });

  const { doRequest, errors } = useRequest({
    url: "/api/products",
    method: "post",
    body: {
      title,
      price,
      image,
      color,
      size,
      brand,
      category,
      material,
      description,
      countInStock,
    },
    onSuccess: () => Router.push("/"),
  });

  if (!currentUser || !currentUser.isAdmin) {
    doAuthorized();
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await doRequest();
    setLoading(false);
  };

  // const onBlur = () => {
  //   const value = parseFloat(price);

  //   if (isNaN(value)) {
  //     return;
  //   }

  //   setPrice(value.toFixed(2));
  // };

  const myLoader = ({ src, width, quality }) => {
    return `https://www.dropbox.com/${src}?raw=1&w=${width}&q=${quality || 75}`;
  };

  return (
    <div className="px-5">
      <Link href="/admin/product" passHref>
        <a type="button" className="btn btn-outline-dark my-3">
          Back
        </a>
      </Link>

      <h1>Create a Product</h1>

      {loading ? (
        <Loader />
      ) : (
        <Container className="mt-5">
          <Row className="justify-content-md-center">
            <Col xs={12} xl={6}>
              <Image
                loader={myLoader}
                src={image || "s/1urt48smfa8pzxx/airpods.jpg"}
                alt="Sample Product"
                width={600}
                height={600}
                fill="responsive"
                objectFit="contain"
              />
            </Col>

            <Col xs={12} xl={6}>
              {errors}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="my-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="price" className="my-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="image" className="my-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="color" className="my-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="size" className="my-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="brand" className="my-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="category" className="my-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Dress">Dress</option>
                    <option value="Set">Set</option>
                    <option value="Outerwear">Outerwear</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="material" className="my-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter material"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="description" className="my-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    row="8"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="countInStock" className="my-3">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter stock number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="dark" className="my-3">
                  Create
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default create;
