import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@thasup-dev/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { getUsersRouter } from './routes/get-users';
import { updateUserRouter } from './routes/update-user';
import { deleteUserRouter } from './routes/delete-user';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
  })
);

app.use(currentUserRouter);
app.use(getUsersRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
