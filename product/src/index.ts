import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI_PRODUCT) {
    throw new Error("JMONGO_URI_PRODUCT must be defined");
  }

  try {
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
