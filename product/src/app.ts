import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@thasup-dev/common";

import { createProductRouter } from "./routes/create-product";
import { getProductRouter } from "./routes/get-product";
import { showProductRouter } from "./routes/show-product";
import { updateProductRouter } from "./routes/update-product";
import { deleteProductRouter } from "./routes/delete-product";
import { deleteReviewRouter } from "./routes/delete-review";
import { createReviewRouter } from "./routes/create-review";
import { showBestProductRouter } from "./routes/bestseller";
import { showMyReviewRouter } from "./routes/show-my-review";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
  })
);
app.use(currentUser);

app.use(showProductRouter);
app.use(createProductRouter);
app.use(showBestProductRouter);
app.use(showMyReviewRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);
app.use(getProductRouter);
app.use(createReviewRouter);
app.use(deleteReviewRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
