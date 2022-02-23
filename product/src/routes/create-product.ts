import express, { Request, Response } from "express";
import { body } from "express-validator";
import { adminUser, requireAuth, validateRequest } from "@thasup-dev/common";

import { Product } from "../models/product";
import { ProductCreatedPublisher } from "../events/publishers/ProductCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

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
    await new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      image: product.image,
      colors: product.colors,
      sizes: product.sizes,
      brand: product.brand,
      category: product.category,
      material: product.material,
      description: product.description,
      numReviews: product.numReviews,
      rating: product.rating,
      countInStock: product.countInStock,
    });

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
