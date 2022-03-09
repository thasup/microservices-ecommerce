import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@thasup-dev/common";

import { showMyOrderRouter } from "./routes/show-my-order";
import { showAllOrderRouter } from "./routes/show-all-order";
import { cancelOrderRouter } from "./routes/cancel-order";
import { getOrderRouter } from "./routes/get-order";
import { createOrderRouter } from "./routes/create-order";

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

app.use(showMyOrderRouter);
app.use(showAllOrderRouter);
app.use(cancelOrderRouter);
app.use(getOrderRouter);
app.use(createOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
