import express, { Request, Response } from "express";
import {
  adminUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@thasup-dev/common";

import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  adminUser,
  async (req: Request, res: Response) => {
    const orders = await Order.find({});

    if (!orders || orders.length === 0) {
      throw new NotFoundError();
    }

    // Only admin fetch all orders data
    if (req.currentUser!.isAdmin === false) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(orders);
  }
);

export { router as showAllOrderRouter };
