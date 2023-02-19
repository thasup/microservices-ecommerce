import express, { type Request, type Response } from 'express';
import { Product } from '../models/product';

const router = express.Router();

router.get('/api/orders/products', async (req: Request, res: Response) => {
  let products = await Product.find({});

  if (products == null) {
    products = [];
  }

  res.status(200).send(products);
});

export { router as showProductRouter };
