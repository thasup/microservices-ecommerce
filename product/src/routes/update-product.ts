import express, { type Request, type Response } from 'express';
import { param } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser
} from '@thasup-dev/common';

import { Product } from '../models/product';
import { ProductUpdatedPublisher } from '../events/publishers/ProductUpdatedPublisher';
import { natsWrapper } from '../NatsWrapper';
import type { ProductAttrs } from '../types/product';

const router = express.Router();

router.patch(
  '/api/products/:id',
  requireAuth,
  adminUser,
  [param('id').isMongoId().withMessage('Invalid MongoDB ObjectId')],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      image1,
      image2,
      image3,
      image4,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      reviews,
      numReviews,
      rating,
      countInStock,
      isReserved
    }: {
      image1: string
      image2: string
      image3: string
      image4: string
    } & ProductAttrs = req.body;

    const product = await Product.findById(req.params.id);

    if (product == null) {
      throw new NotFoundError();
    }

    if (product.isReserved) {
      // throw new BadRequestError("Cannot edit a reserved product");
      // TODO: figure out why reserve need to be overide
      product.isReserved = isReserved;
    }

    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.images = {
      image1: image1 ?? product.images.image1,
      image2: image2 ?? product.images.image2,
      image3: image3 ?? product.images.image3,
      image4: image4 ?? product.images.image4
    };
    product.colors = colors ?? product.colors;
    product.sizes = sizes ?? product.sizes;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.material = material ?? product.material;
    product.description = description ?? product.description;
    product.reviews = reviews ?? product.reviews;
    product.numReviews = numReviews ?? product.numReviews;
    product.rating = rating ?? product.rating;
    product.countInStock = countInStock ?? product.countInStock;

    await product.save();

    await new ProductUpdatedPublisher(natsWrapper.client).publish({
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
      version: product.version
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
