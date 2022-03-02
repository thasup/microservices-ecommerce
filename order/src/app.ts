import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@thasup-dev/common";

import { showOrderRouter } from "./routes/show-order";
import { cancelOrderRouter } from "./routes/update-order";
import { getOrderRouter } from "./routes/get-order";
import { createOrderRouter } from "./routes/create-order";
import { addToCartRouter } from "./routes/add-to-cart";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(showOrderRouter);
app.use(cancelOrderRouter);
app.use(getOrderRouter);
app.use(createOrderRouter);
app.use(addToCartRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
