import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@thasup-dev/common";

import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/myorders",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id });

    if (!orders || orders.length === 0) {
      throw new NotFoundError();
    }

    res.status(200).send(orders);
  }
);

export { router as showMyOrderRouter };
