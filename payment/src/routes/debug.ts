import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@thasup-dev/common";
import { Order } from "../models/order";
import { Product } from "../models/product";

const router = express.Router();

router.get(
  "/api/payments",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.find({});

    if (!order) {
      throw new NotFoundError();
    }

    const product = await Product.find({});
    if (!product) {
      throw new NotFoundError();
    }

    console.log("thasup x 007", order);

    console.log("thasup x 008", product);

    res.status(200).send({ order, product });
  }
);

export { router as debugRouter };
