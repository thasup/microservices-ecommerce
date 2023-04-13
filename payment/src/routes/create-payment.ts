import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus
} from '@thasup-dev/common';
import { stripe } from '../stripe';

import { Order } from '../models/order';
import { natsWrapper } from '../NatsWrapper';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage('Invalid MongoDB ObjectId')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (order == null) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    if (order.paymentMethod === 'paypal') {
      const payment = Payment.build({
        orderId,
        stripeId: token
      });

      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
      });

      res.status(201).send(payment);
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.totalPrice * 100,
      source: token
    });

    if (charge?.id == null) {
      throw new Error('Payment failed to proceed correctly');
    }

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
