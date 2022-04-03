import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";
import { natsWrapper } from "../../NatsWrapper";

const createProduct = async () => {
  const adminId = new mongoose.Types.ObjectId().toHexString();

  const { body: product } = await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin(adminId))
    .send({
      title: "Sample Dress",
      price: 99,
      userId: adminId,
      image1: "./asset/sample.jpg",
      colors: "White,Black",
      sizes: "S,M,L",
      brand: "Uniqlo",
      category: "Dress",
      material: "Polyester 100%",
      description:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      numReviews: 0,
      rating: 0,
      countInStock: 12,
    });
  return product;
};

it("return 404 when the product data is not found", async () => {
  // Create a product
  const product = await createProduct();

  const anotherProductId = new mongoose.Types.ObjectId().toHexString();

  // Create a review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin())
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Make a delete request
  await request(app)
    .delete(`/api/products/${anotherProductId}/reviews`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("return 401 when make a request without signed in", async () => {
  // Create a product
  const product = await createProduct();

  // Create a review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin())
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Make a delete request without signed in
  await request(app)
    .delete(`/api/products/${product.id}/reviews`)
    .send()
    .expect(401);
});

it("return 404 when user trying to delete non-existent review", async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create a review by another user
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin())
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Make a delete request on non-existent review
  await request(app)
    .delete(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(404);
});

it("return 200 when make a successful request", async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create a review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Make a delete request
  await request(app)
    .delete(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(200);

  // Find the deleted product
  const deletedProduct = await Product.findById(product.id);

  expect(deletedProduct!.reviews!.length).toEqual(0);
  expect(deletedProduct!.reviews![0]).toEqual(undefined);
});

it("update new rating and numReviews correctly when recieve new several request", async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create a 1st review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Create a 2nd review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin())
    .send({
      title: "Love It!",
      rating: 5,
      comment: "Elit sed vulputate mi sit amet mauris commodo quis imperdiet.",
    })
    .expect(201);

  // Make a delete request on 1st review
  await request(app)
    .delete(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(200);

  // Find the updated product
  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct).toBeDefined();
  expect(updatedProduct!.rating).toEqual(5);
  expect(updatedProduct!.numReviews).toEqual(1);
  expect(updatedProduct!.reviews!.length).toEqual(1);
  expect(updatedProduct!.reviews![0].title).toEqual("Love It!");
});

it("publishes an event", async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create a review
  await request(app)
    .post(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send({
      title: "Good Quality",
      rating: 4,
      comment:
        "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
    })
    .expect(201);

  // Make a delete request
  await request(app)
    .delete(`/api/products/${product.id}/reviews`)
    .set("Cookie", global.signin(userId))
    .send({})
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);
});
