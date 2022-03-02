import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@thasup-dev/common";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { natsWrapper } from "../../NatsWrapper";
import { Cart } from "../../models/cart";

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
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 99,
  });
  await product.save();

  const cart = Cart.build({
    userId: product.userId,
    title: product.title,
    qty: 1,
    image: product.image,
    price: product.price,
    discount: 1,
    product,
  });

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));
  const order = Order.build({
    userId: "123456",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    cart: [cart],
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
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
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  const cart = Cart.build({
    userId: product.userId,
    title: product.title,
    qty: 1,
    image: product.image,
    price: product.price,
    discount: 1,
    product,
  });

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));
  const order = Order.build({
    userId: "123456",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    cart: [cart],
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
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
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
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

it("emits an order created event", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  // make a request to create an order
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
