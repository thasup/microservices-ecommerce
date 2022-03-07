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

const router = express.Router();

router.post(
  "/api/products/:productId/reviews",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("rating").not().isEmpty().withMessage("Rating is required"),
    body("comment").not().isEmpty().withMessage("Comment is required"),
    param("productId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, rating, comment } = req.body;

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

      product.save(function (err) {
        if (err) {
          console.log(err);
        }
      });

      res.status(200).send(review);
    }
  }
);

export { router as createReviewRouter };
