import express, { type Request, type Response } from 'express';
import {
  requireAuth
} from '@thasup-dev/common';

import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  let orders = await Order.find({});

  if (orders == null) {
    orders = [];
  }

  res.status(200).send(orders);
});

export { router as showAllOrderRouter };
