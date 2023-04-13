import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import type { ProductDoc } from '../../types/product';

const buildProduct = async (): Promise<ProductDoc> => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Sample Dress',
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: './asset/sample.jpg',
    colors: 'White,Black',
    sizes: 'S,M,L',
    countInStock: 1,
    numReviews: 0,
    rating: 0,
    isReserved: false
  });
  await product.save();

  return product;
};

it('can fetch a list of products', async () => {
  await buildProduct();
  await buildProduct();
  await buildProduct();

  const response = await request(app).get('/api/payments/products').send().expect(200);

  expect(response.body.length).toEqual(3);
});
