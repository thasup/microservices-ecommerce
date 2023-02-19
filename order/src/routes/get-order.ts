import express, { type Request, type Response } from 'express';
import { param } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest
} from '@thasup-dev/common';

import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [param('orderId').isMongoId().withMessage('Invalid MongoDB ObjectId')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (order == null) {
      throw new NotFoundError();
    }

    // Only admin *OR* the user who request that order
    // can get an access to the order
    if (
      order.userId !== req.currentUser!.id &&
      !req.currentUser!.isAdmin
    ) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as getOrderRouter };
