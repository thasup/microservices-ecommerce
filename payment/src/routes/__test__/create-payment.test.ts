import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@thasup-dev/common";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    isReserved: false,
  });
  await product.save();

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  // Create and save the order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    isReserved: false,
  });
  await product.save();

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  // Create and save the order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 0,
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "asdlkfj",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: price,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    isReserved: false,
  });
  await product.save();

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  // Create and save the order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
  });
  await order.save();
  console.log(order);

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  console.log("SHOW ME!!!", chargeOptions);

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.totalPrice * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
