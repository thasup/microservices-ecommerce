import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { Product } from "../../models/product";

it("fetches the order by the user themself", async () => {
  // Create a product
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

  const user = global.signin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  // make request to fetch the order by *USER* themself
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("fetches the order by admin", async () => {
  // Create a product
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

  const user = global.signin();
  const admin = global.adminSignin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  // make request to fetch the order by *ADMIN*
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", admin)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a product
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

  const user = global.signin();
  const anotherUser = global.signin();

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  // make request to fetch the order by *ANOTHER USER*
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .send()
    .expect(401);
});
