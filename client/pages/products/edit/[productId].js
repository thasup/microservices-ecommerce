import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Router, { useRouter } from "next/router";

import CustomCarousol from "../../../components/CustomCarousel";
import useRequest from "../../../hooks/use-request";
import Loader from "../../../components/Loader";

const EditProduct = ({ products }) => {
  const { productId } = useRouter().query;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const [loading, setLoading] = useState(true);
  const [imageArray, setImageArray] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const product = products.find((product) => product.id === productId);

  const { doRequest, errors } = useRequest({
    url: `/api/products/${productId}`,
    method: "patch",
    body: {
      title,
      price,
      image1,
      image2,
      image3,
      image4,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      countInStock,
    },
    onSuccess: () => {
      setLoadingUpdate(false);
      Router.push(`/products/${productId}`);
    },
  });

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setImage1(product.images.image1);
      setImage2(product.images.image2);
      setImage3(product.images.image3);
      setImage4(product.images.image4);
      setColors(product.colors);
      setSizes(product.sizes);
      setBrand(product.brand);
      setCategory(product.category);
      setMaterial(product.material);
      setDescription(product.description);
      setCountInStock(product.countInStock);

      if (imageArray.length === 0) {
        const images = Object.values(product.images);

        const filterImages = images.filter(
          (image) => image !== null && image !== ""
        );

        setLoading(false);
        setImageArray(filterImages);
      }
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    doRequest();
  };

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <Container className="app-container">
      <Row>
        <Col xs={12} xl={6} className="d-flex justify-content-center mb-5">
          <CustomCarousol images={imageArray} quality={50} />
        </Col>

        <Col xs={12} xl={3}>
          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image 1 URL"
              value={image1}
              onChange={(e) => setImage1(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image 2 URL"
              value={image2}
              onChange={(e) => setImage2(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image 3</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image 3 URL"
              value={image3}
              onChange={(e) => setImage3(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image 4</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image 4 URL"
              value={image4}
              onChange={(e) => setImage4(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} xl={3}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="color" className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter color"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="size" className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter size"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
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
                <option value="Coat">Coat</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="material" className="mb-3">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                row="8"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="mb-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {errors}
            <Button type="submit" variant="dark" className="my-3">
              {loadingUpdate ? (
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
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;
