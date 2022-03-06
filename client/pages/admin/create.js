import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";

import FormContainer from "../../components/FormContainer";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import useRequest from "../../hooks/use-request";

const create = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/products",
    method: "post",
    body: {
      title,
      price,
      image1,
      image2,
      image3,
      image4,
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

              <>
                <Form.Group controlId="image" className="my-3">
                  <Form.Label>Image 1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image 1 URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="image" className="my-3">
                  <Form.Label>Image 2</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image 2 URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="image" className="my-3">
                  <Form.Label>Image 3</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image 3 URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="image" className="my-3">
                  <Form.Label>Image 4</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image 4 URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </>
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
