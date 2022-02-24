import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@thasup-dev/common";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { natsWrapper } from "../../NatsWrapper";

it("returns an error if the product does not exist", async () => {
  const productId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: productId })
    .expect(404);
});

it("return 201 if the product has more than 1 set", async () => {
  const product = Product.build({
    title: "Sample Dress",
    price: 1990,
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 99,
  });
  await product.save();

  const order = Order.build({
    userId: "123456",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    product,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});

it("returns an error if the product is already reserved", async () => {
  const product = Product.build({
    title: "Sample Dress",
    price: 1990,
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  const order = Order.build({
    userId: "123456",
    status: OrderStatus.Complete,
    expiresAt: new Date(),
    product,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(400);
});

it("reserves a product", async () => {
  const product = Product.build({
    title: "Sample Dress",
    price: 1990,
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});
