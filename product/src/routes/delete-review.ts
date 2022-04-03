import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { Review } from "../models/review";
import { ProductUpdatedPublisher } from "../events/publishers/ProductUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.delete(
  "/api/products/:productId/reviews",
  requireAuth,
  [param("productId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    // Check the product is existing
    const product = await Product.findById(req.params.productId);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.reviews) {
      // Filter all reviews of the product *EXCEPT* the review of this user
      const updateReviews = product.reviews.filter(
        (review) => review.userId.toString() !== req.currentUser!.id
      );

      // Calculate numReviews and rating
      let numReviews;
      let productRating;
      if (updateReviews.length !== 0) {
        numReviews = updateReviews.length;
        productRating =
          updateReviews.reduce((acc, item) => item.rating + acc, 0) /
          numReviews;
      } else {
        numReviews = 0;
        productRating =
          updateReviews.reduce((acc, item) => item.rating + acc, 0) / 1;
      }

      // Update Product
      product.reviews = updateReviews;
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

      const review = await Review.findOne({ userId: req.currentUser!.id });

      if (!review) {
        throw new NotFoundError();
      }

      await review.remove();
    }

    res.status(200).send(product);
  }
);

export { router as deleteReviewRouter };
