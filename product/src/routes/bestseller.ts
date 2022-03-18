import express, { Request, Response } from "express";
import { Product } from "../models/product";

const router = express.Router();

router.get("/api/products/bestseller", async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(12);

  res.send(products);
});

export { router as showBestProductRouter };
