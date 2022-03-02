import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderUpdatedEvent, OrderStatus } from "@thasup-dev/common";
import { OrderUpdatedListener } from "../OrderUpdatedListener";
import { Product } from "../../../models/product";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderUpdatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    brand: "Uniqlo",
    category: "Dress",
    material: "Polyester 100%",
    description:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    numReviews: 0,
    rating: 0,
    countInStock: 1,
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();
  product.set({ orderId: orderId });
  await product.save();

  // Create the fake data event
  const data: OrderUpdatedEvent["data"] = {
    id: orderId,
    version: 0,
    status: OrderStatus.Cancelled,
    userId: product.userId,
    expiresAt: new Date(),
    product: {
      id: product.id,
      title: "Sample Dress",
      price: 1990,
      image: "./asset/sample.jpg",
      colors: "White,Black",
      sizes: "S,M,L",
      countInStock: 1,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, orderId, data, msg };
};

it("updates the order to updated status", async () => {
  const { listener, product, orderId, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { listener, product, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a product updated event", async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
