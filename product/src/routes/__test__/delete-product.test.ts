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

it("return 401 when make a request by user without authorized", async () => {
  // Create a product
  await createProduct();

  const anotherProductId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app)
    .delete(`/api/products/${anotherProductId}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(401);
});

it("return 404 when the product data is not found", async () => {
  // Create a product
  await createProduct();

  const anotherProductId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app)
    .delete(`/api/products/${anotherProductId}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(404);
});

it("return 200 when make a successful request", async () => {
  // Create a product
  const product = await createProduct();

  // Make a delete request
  await request(app)
    .delete(`/api/products/${product.id}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(200);

  // Find the deleted product
  const deletedProduct = await Product.findById(product.id);

  expect(deletedProduct).toEqual(null);
});

it("publishes an event", async () => {
  // Create a product
  const product = await createProduct();

  // Make a delete request
  await request(app)
    .delete(`/api/products/${product.id}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
