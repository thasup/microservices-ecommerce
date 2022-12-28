import { requireAuth } from "@thasup-dev/common";
import express, { Request, Response } from "express";
import { Review } from "../models/review";

const router = express.Router();

router.get(
  "/api/products/myreviews",
  requireAuth,
  async (req: Request, res: Response) => {
    let reviews = await Review.find({ userId: req.currentUser!.id });

    if (!reviews || reviews.length < 1) {
      reviews = []
    }

    res.status(200).send(reviews);
  }
);

export { router as getMyReviewsRouter };
