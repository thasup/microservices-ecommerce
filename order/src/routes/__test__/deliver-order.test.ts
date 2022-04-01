import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Product, ProductDoc } from "../../models/product";
import { Order } from "../../models/order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderStatus } from "@thasup-dev/common";

const buildProduct = async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    numReviews: 0,
    rating: 0,
    isReserved: false,
  });
  await product.save();

  return product;
};

const buildJSON = (product: ProductDoc, userId: string) => {
  const jsonCartItems = JSON.stringify([
    {
      userId: userId,
      title: product.title,
      qty: 1,
      color: "white",
      size: "M",
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      discount: 1,
      productId: product.id,
    },
  ]);

  const jsonShippingAddress = JSON.stringify({
    address: "sunset villa",
    city: "New York",
    postalCode: "44205",
    country: "USA",
  });

  const jsonPaymentMethod = JSON.stringify("stripe");

  return { jsonCartItems, jsonShippingAddress, jsonPaymentMethod };
};

it("return 401 when trying to marks an order as delivered by user", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make a request to mark the order as delivered
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(401);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(false);
  expect(updatedOrder!.deliveredAt).toBeUndefined();
});

it("return 400 when trying to marks an unpaid order as delivered", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make a request to mark the *UNPAID* order as delivered
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(400);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(false);
  expect(updatedOrder!.deliveredAt).toBeUndefined();
});

it("marks an order as delivered by admin", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // Change order status to be completed (paid an order)
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Completed,
    isPaid: true,
    paidAt: new Date(),
  });
  await newOrder!.save();

  // make a request to mark the *PAID* order as delivered
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(200);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(true);
  expect(updatedOrder!.deliveredAt).toBeDefined();
});

it("emits a order updated event", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // Create  an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // Change order status to be completed (paid an order)
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Completed,
    isPaid: true,
    paidAt: new Date(),
  });
  await newOrder!.save();

  // make a request to mark the order as delivered
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
