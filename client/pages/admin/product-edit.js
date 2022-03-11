import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useRequest from "../../hooks/use-request";

const editProductPage = ({ products, currentUser }) => {
  const { productId } = useRouter().query;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    // if (successUpdate) {
    //   dispatch({ type: PRODUCT_UPDATE_RESET });
    //   navigate("/admin/productlist");
    // } else {
    //   if (!product.name || product._id !== productId) {
    //     dispatch(listProductDetails(productId));
    //   } else {
    //     setName(product.name);
    //     setPrice(product.price);
    //     setImage(product.image);
    //     setBrand(product.brand);
    //     setCategory(product.category);
    //     setCountInStock(product.countInStock);
    //     setDescription(product.description);
    //   }
    // }
  }, [dispatch, navigate, product, productId, successUpdate]);

  // const uploadFileHandler = async (e) => {
  //     const file = e.target.files[0];
  //     const formData = new FormData();

  //     formData.append("image", file);
  //     setUploading(true);

  //     try {
  //         const config = {
  //             headers: {
  //                 "Content-Type": "multipart/form-data",
  //                 Authorization: `Bearer ${userInfo.token}`,
  //             },
  //         };

  //         const { data } = await axios.post("/api/upload", formData, config);

  //         setImage(data);
  //         setUploading(false);
  //     } catch (error) {
  //         console.error(error);
  //         setUploading(false);
  //     }
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <>
      <Link href="/admin/product" passHref>
        <a type="button" className="btn btn-outline-dark my-3">
          Back
        </a>
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {/* {loadingUpdate && <Loader />} */}
        {/* {errorUpdate && <Message variant="danger">{errorUpdate}</Message>} */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title" className="my-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
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

            <Form.Group className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                id="image"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                id="image-file"
                label="Choose File"
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
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
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default editProductPage;
