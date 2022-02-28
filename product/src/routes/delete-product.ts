import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  adminUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Product } from "../models/product";

const router = express.Router();

router.delete(
  "/api/products/:productId",
  requireAuth,
  adminUser,
  [param("productId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const deletedProduct = await Product.findById(req.params.productId);

    // Check the product is existing
    if (!deletedProduct) {
      throw new NotFoundError();
    }

    deletedProduct.remove();

    res.status(200).send({});
  }
);

export { router as deleteProductRouter };
