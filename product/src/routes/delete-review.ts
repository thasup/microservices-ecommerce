import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  DatabaseConnectionError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";
import mongoose from "mongoose";

import { Product } from "../models/product";

const router = express.Router();

router.delete(
  "/api/products/:ProductId/reviews",
  requireAuth,
  [param("ProductId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    // Check the product is existing
    const product = await Product.findById(req.params.ProductId).populate(
      "Review"
    );
    if (!product) {
      throw new NotFoundError();
    }

    // Handle mongoDB transactions
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Filter all reviews of the product *EXCEPT* the review of this user
      const reviews = product.reviews!.filter(
        (review: any) => review.userId.toString() !== req.currentUser!.id
      );

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

export { router as deleteReviewRouter };
