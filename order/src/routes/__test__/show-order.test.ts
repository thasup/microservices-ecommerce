import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";

const buildProduct = async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  return product;
};

it("fetches orders for an particular user", async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ productId: productOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ productId: productTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ productId: productThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].product.id).toEqual(productTwo.id);
  expect(response.body[1].product.id).toEqual(productThree.id);
});

it("fetches all orders by admin", async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOne = global.signin();
  const userTwo = global.signin();
  const admin = global.adminSignin();

  // Create one order as User #1
  const { body: orderOneForUserOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ productId: productOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOneForUserTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ productId: productTwo.id })
    .expect(201);
  const { body: orderTwoForUserTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ productId: productThree.id })
    .expect(201);

  // Make request to get all orders by *ADMIN*
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", admin)
    .expect(200);

  // Make sure we got all orders for admin
  expect(response.body.length).toEqual(3);
  expect(response.body[0].id).toEqual(orderOneForUserOne.id);
  expect(response.body[1].id).toEqual(orderOneForUserTwo.id);
  expect(response.body[2].id).toEqual(orderTwoForUserTwo.id);
  expect(response.body[0].product.id).toEqual(productOne.id);
  expect(response.body[1].product.id).toEqual(productTwo.id);
  expect(response.body[2].product.id).toEqual(productThree.id);
});
