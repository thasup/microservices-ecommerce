import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";
import { Order } from "../models/order";
import { param } from "express-validator";
import { natsWrapper } from "../NatsWrapper";
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("product");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      product: {
        id: order.product.id,
        title: order.product.title,
        price: order.product.price,
        image: order.product.image,
        colors: order.product.colors,
        sizes: order.product.sizes,
        countInStock: order.product.countInStock,
      },
    });

    res.status(200).send(order);
  }
);

export { router as patchOrderRouter };
