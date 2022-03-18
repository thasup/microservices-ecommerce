import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ProductUpdatedEvent } from "@thasup-dev/common";
import { ProductUpdatedListener } from "../ProductUpdatedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Product } from "../../../models/product";

const setup = async () => {
  // Create a listener
  const listener = new ProductUpdatedListener(natsWrapper.client);

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
    numReviews: 0,
    rating: 0,
    isReserved: false,
  });
  await product.save();

  // Create a fake data object
  const data: ProductUpdatedEvent["data"] = {
    id: product.id,
    version: product.version + 1,
    title: "Sample Dress 2",
    price: 690,
    userId: product.userId,
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
    isReserved: true,
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, product, listener };
};

it("finds, updates, and saves a product", async () => {
  const { msg, data, product, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.isReserved).toEqual(data.isReserved);
  expect(updatedProduct!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, product } = await setup();

  data.version = data.version + 1;

  expect(listener.onMessage(data, msg)).rejects.toThrow();

  expect(msg.ack).not.toHaveBeenCalled();
});
