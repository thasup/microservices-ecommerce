import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { ProductUpdatedPublisher } from "../events/publishers/ProductUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";

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
      product.colors = req.body.colors ?? product.colors;
      product.sizes = req.body.sizes ?? product.sizes;
      product.brand = req.body.brand ?? product.brand;
      product.category = req.body.category ?? product.category;
      product.material = req.body.material ?? product.material;
      product.description = req.body.description ?? product.description;
      product.countInStock = req.body.countInStock ?? product.countInStock;

      await product.save();

      new ProductUpdatedPublisher(natsWrapper.client).publish({
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
    } else {
      throw new NotFoundError();
    }

    res.send(product);
  }
);

export { router as updateProductRouter };
