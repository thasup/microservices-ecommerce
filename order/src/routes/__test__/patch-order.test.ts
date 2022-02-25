import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";
import { Order } from "../../models/order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderStatus } from "@thasup-dev/common";

it("marks an order as cancelled", async () => {
  // create a product with Product Model
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
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
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

  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
