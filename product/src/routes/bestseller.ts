import { NotFoundError } from "@thasup-dev/common";
import express, { Request, Response } from "express";
import { Product } from "../models/product";

const router = express.Router();

router.get("/api/products/bestseller", async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 });

	if (!products.length) {
		throw new NotFoundError();
	}

  res.send(products);
});

export { router as bestsellerRouter };
