import express, { Request, Response } from "express";
import { body } from "express-validator";
import { adminUser, requireAuth, validateRequest } from "@thasup-dev/common";
import { Product } from "../models/product";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  adminUser,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      image,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      reviews,
      numReviews,
      rating,
      countInStock,
    } = req.body;

    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
      image,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      reviews,
      numReviews,
      rating,
      countInStock,
    });

    await product.save();

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
