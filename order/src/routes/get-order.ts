import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
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

    res.status(200).send(order);
  }
);

export { router as getOrderRouter };
