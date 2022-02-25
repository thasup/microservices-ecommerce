import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";
import mongoose from "mongoose";

import { Product } from "../models/product";

const router = express.Router();

router.post(
  "/api/products/:ProductId/reviews",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("rating")
      .isInt({ gt: 0 })
      .withMessage("Rating must be greater than 0"),
    body("comment").not().isEmpty().withMessage("Comment is required"),
    param("ProductId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, rating, comment } = req.body;

    // Check if user successfully purchased the product before reviewing

    // Check the product is existing
    const product = await Product.findById(req.params.ProductId).populate(
      "Review"
    );
    if (!product) {
      throw new NotFoundError();
    }

    // Check user does *NOT* already reviewed the product
    const alreadyReviewed = product.reviews!.find(
      (review: any) => review.userId.toString() === req.currentUser!.id
    );
    if (alreadyReviewed) {
      throw new BadRequestError("Product already reviewed");
    }

    // Handle mongoDB transactions
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Create the review
      const review = {
        title,
        rating,
        comment,
        userId: req.currentUser!.id,
      };

      product.reviews!.push(review);

      // Calculate and update numReviews and rating in Product database
      product.numReviews = product.reviews!.length;
      product.rating =
        product.reviews!.reduce(
          (acc: number, item: { rating: number }) => item.rating + acc,
          0
        ) / product.reviews!.length;

      await product.save();

      await session.commitTransaction();
      res.status(201).send(product);
    } catch (err) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
  }
);

export { router as createReviewRouter };
