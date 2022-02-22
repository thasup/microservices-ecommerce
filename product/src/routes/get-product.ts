import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "@thasup-dev/common";
import { Product } from "../models/product";

const router = express.Router();

router.get(
  "/api/products/:id",
  [param("id").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    res.send(product);
  }
);

export { router as showProductRouter };
