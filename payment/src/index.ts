import mongoose from "mongoose";
import { app } from "./app";
import { OrderUpdatedListener } from "./events/listeners/OrderUpdatedListener";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
import { ProductCreatedListener } from "./events/listeners/ProductCreatedListener";
import { ProductDeletedListener } from "./events/listeners/ProductDeletedListener";
import { ProductUpdatedListener } from "./events/listeners/ProductUpdatedListener";
import { natsWrapper } from "./NatsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI_PAYMENT) {
    throw new Error("JMONGO_URI_PAYMENT must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();
    new ProductDeletedListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI_PAYMENT);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`Payment server: Listening on port ${port}`);
  });
};

start();
