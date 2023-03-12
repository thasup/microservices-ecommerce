import { NotFoundError } from '@thasup-dev/common';
import express, { type Request, type Response } from 'express';

import { Product } from '../models/product';

const router = express.Router();

router.get('/api/products/bestseller', async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 });

  if (products.length < 1) {
    throw new NotFoundError();
  }

  res.send(products);
});

export { router as bestsellerRouter };
