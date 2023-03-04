import express, { type Request, type Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@thasup-dev/common';
import { param } from 'express-validator';

import { Order } from '../models/order';
import { natsWrapper } from '../NatsWrapper';
import { OrderUpdatedPublisher } from '../events/publishers/OrderUpdatedPublisher';

const router = express.Router();

router.patch(
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

    // Only order owner can make a request
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    await new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Cancelled,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: order.cart,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered
    });

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
