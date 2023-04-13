import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@thasup-dev/common';

import { createChargeRouter } from './routes/create-payment';
import { getPaymentRouter } from './routes/get-payment';
import { showProductsRouter } from './routes/show-products';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
  })
);
app.use(currentUser);

app.use(showProductsRouter);
app.use(createChargeRouter);
app.use(getPaymentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
