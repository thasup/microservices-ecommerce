import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser,
  BadRequestError,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { ProductUpdatedPublisher } from "../events/publishers/ProductUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.patch(
  "/api/products/:id",
  requireAuth,
  adminUser,
  [param("id").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      image1,
      image2,
      image3,
      image4,
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

    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.images.image1 = image1 ?? product.images.image1;
    product.images.image2 = image2 ?? product.images.image2;
    product.images.image3 = image3 ?? product.images.image3;
    product.images.image4 = image4 ?? product.images.image4;
    product.colors = colors ?? product.colors;
    product.sizes = sizes ?? product.sizes;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.material = material ?? product.material;
    product.description = description ?? product.description;
    product.reviews = reviews ?? product.reviews;
    product.numReviews = numReviews ?? product.numReviews;
    product.rating = rating ?? product.rating;
    product.countInStock = countInStock ?? product.countInStock;

    await product.save();

    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: title,
      price: price,
      userId: product.userId,
      image: product.images.image1,
      colors: colors,
      sizes: sizes,
      brand: brand,
      category: category,
      material: material,
      description: description,
      numReviews: numReviews,
      rating: rating,
      countInStock: countInStock,
      isReserved: product.isReserved,
      orderId: product.orderId,
      version: product.version,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
