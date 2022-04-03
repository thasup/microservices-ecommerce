import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";
import { param } from "express-validator";

import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { OrderUpdatedPublisher } from "../events/publishers/OrderUpdatedPublisher";

const router = express.Router();

router.patch(
  "/api/orders/:orderId/deliver",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Only admin can make a request
    if (req.currentUser!.isAdmin !== true) {
      throw new NotAuthorizedError();
    }

    if (order.status !== OrderStatus.Completed) {
      throw new BadRequestError("Order still hasn't paid");
    }

    order.set({ isDelivered: true, deliveredAt: new Date() });
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
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
      isDelivered: true,
      deliveredAt: new Date(),
    });

    res.status(200).send(order);
  }
);

export { router as deliverOrderRouter };
