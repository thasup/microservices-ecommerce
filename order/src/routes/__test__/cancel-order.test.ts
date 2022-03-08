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
    isReserved: false,
    orderId: undefined,
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

it("marks an order as cancelled", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(200);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order updated event", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
