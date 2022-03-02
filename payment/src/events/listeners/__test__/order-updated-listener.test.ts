import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, OrderUpdatedEvent } from "@thasup-dev/common";

import { OrderUpdatedListener } from "../OrderUpdatedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Order } from "../../../models/order";
import { Product } from "../../../models/product";

const setup = async () => {
  const listener = new OrderUpdatedListener(natsWrapper.client);

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
  });
  await product.save();

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "123456",
    status: OrderStatus.Created,
    version: 0,
    paymentMethod: "stripe",
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice,
  });
  await order.save();

  const data: OrderUpdatedEvent["data"] = {
    id: order.id,
    status: OrderStatus.Cancelled,
    userId: order.userId,
    expiresAt: new Date(),
    version: 1,
    paymentMethod: order.paymentMethod,
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,
    taxPrice: order.taxPrice,
    totalPrice: order.totalPrice,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
