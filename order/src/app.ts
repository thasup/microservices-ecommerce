import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@thasup-dev/common";

import { showOrderRouter } from "./routes/show-order";
import { deleteOrderRouter } from "./routes/delete-order";
import { getOrderRouter } from "./routes/get-order";
import { showAllOrderRouter } from "./routes/show-all-order";
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

app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(getOrderRouter);
app.use(showAllOrderRouter);
app.use(createOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
