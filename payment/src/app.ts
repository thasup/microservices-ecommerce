import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@thasup-dev/common";

import { createChargeRouter } from "./routes/create-payment";
import { getPaymentRouter } from "./routes/get-payment";
import { paypalRouter } from "./routes/paypal";
import { showProductRouter } from "./routes/show-product";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NOND_ENV === "production",
	})
);
app.use(currentUser);

app.use(showProductRouter);
app.use(createChargeRouter);
app.use(getPaymentRouter);
app.use(paypalRouter);

app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
