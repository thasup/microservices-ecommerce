import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@thasup-dev/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
// import { Payment } from '../models/payment';
import { natsWrapper } from "../NatsWrapper";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty(),
    body("orderId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    order.product.price = 15;

    console.log("thasup / create charge / order", order);

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.product.price * 100,
      source: token,
    });

    console.log("thasup / create charge / amount", charge.amount);

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
      version: 0,
    });
    await payment.save();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
      version: payment.version,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
