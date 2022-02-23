import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./NatsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI_PRODUCT) {
    throw new Error("JMONGO_URI_PRODUCT must be defined");
  }

  try {
    await natsWrapper.connect(
      "microservices-ecommerce",
      "123",
      "http://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI_PRODUCT);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`Product server: Listening on port ${port}`);
  });
};

start();
