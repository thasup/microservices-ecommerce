import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser,
} from "@thasup-dev/common";
import { Product } from "../models/product";

const router = express.Router();

router.patch(
  "/api/products/:id",
  requireAuth,
  adminUser,
  [
    param("id").isMongoId().withMessage("Invalid MongoDB ObjectId"),
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = req.body.title ?? product.title;
      product.price = req.body.price ?? product.price;
      product.image = req.body.image ?? product.image;
      product.colors = req.body.color ?? product.colors;
      product.sizes = req.body.size ?? product.sizes;
      product.brand = req.body.brand ?? product.brand;
      product.category = req.body.category ?? product.category;
      product.material = req.body.material ?? product.material;
      product.description = req.body.description ?? product.description;
      product.countInStock = req.body.countInStock ?? product.countInStock;

      await product.save();
    } else {
      throw new NotFoundError();
    }

    res.send(product);
  }
);

export { router as updateProductRouter };
