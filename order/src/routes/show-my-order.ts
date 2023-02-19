import express, { type Request, type Response } from 'express';
import {
  requireAuth
} from '@thasup-dev/common';

import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/myorders',
  requireAuth,
  async (req: Request, res: Response) => {
    let orders = await Order.find({ userId: req.currentUser!.id });

    if (orders == null) {
      orders = [];
    }

    res.status(200).send(orders);
  }
);

export { router as showMyOrderRouter };
