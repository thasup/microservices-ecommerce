import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
} from "@thasup-dev/common";
import { param } from "express-validator";
import { Payment } from "../models/payment";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/payments:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const payment = await Payment.find({ orderId: req.params.orderId });

    if (!payment) {
      throw new NotFoundError();
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Only admin *OR* the user who request that order can only access the order
    if (
      order.userId !== req.currentUser!.id &&
      req.currentUser!.isAdmin === false
    ) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(payment);
  }
);

export { router as getPaymentRouter };
