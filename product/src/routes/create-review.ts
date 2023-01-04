import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { Review } from "../models/review";
import { ProductUpdatedPublisher } from "../events/publishers/ProductUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";
import type { ReviewAttrs } from "../types/review";

const router = express.Router();

router.post(
  "/api/products/:productId/reviews",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("rating").not().isEmpty().isInt({ gt: 0 }).withMessage("Rating is required"),
    body("comment").not().isEmpty().withMessage("Comment is required"),
    param("productId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, rating, comment }: ReviewAttrs = req.body;

    // Check the product is existing
    const product = await Product.findById(req.params.productId);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.reviews) {
      // Check user does *NOT* already reviewed the product
      const alreadyReviewed = product.reviews.find(
        (review) => review.userId.toString() === req.currentUser!.id
      );

      if (alreadyReviewed) {
        throw new BadRequestError("Product already reviewed");
      }

      // Check user successfully purchased the product before trying to review

      // Create a review
      const review = Review.build({
        title,
        rating,
        comment,
        userId: req.currentUser!.id,
        productTitle: product.title,
        productId: product.id,
      });

      await review.save();

      // Update reviews in Product database
      product.reviews.push(review);

      // Calculate numReviews and rating
      let numReviews;
      let productRating;
      if (product.reviews.length !== 0) {
        numReviews = product.reviews?.length;
        productRating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          numReviews;
      } else {
        numReviews = 0;
        productRating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) / 1;
      }

      // Update numReviews and rating in Product database
      product.numReviews = numReviews ?? product.numReviews;
      product.rating = parseFloat(productRating.toFixed(1)) ?? product.rating;

      await product.save();

      new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        title: product.title,
        price: product.price,
        userId: product.userId,
        image: product.images.image1,
        colors: product.colors,
        sizes: product.sizes,
        brand: product.brand,
        category: product.category,
        material: product.material,
        description: product.description,
        numReviews: product.numReviews,
        rating: product.rating,
        countInStock: product.countInStock,
        isReserved: product.isReserved,
        version: product.version,
      });

      res.status(201).send(review);
    }
  }
);

export { router as createReviewRouter };
