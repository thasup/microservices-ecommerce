import express, { Request, Response } from "express";
import {
  adminUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@thasup-dev/common";

import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  let orders = await Order.find({});

  // Only admin fetch all orders data
  // if (req.currentUser!.isAdmin === false) {
  //   throw new NotAuthorizedError();
  // }

  if (!orders || orders.length === 0) {
    orders = [];
  }

  res.status(200).send(orders);
});

export { router as showAllOrderRouter };
