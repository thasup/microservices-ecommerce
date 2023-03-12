import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../NatsWrapper';
import { Product } from '../../models/product';
import type { ProductDoc } from '../../types/product';

const createProduct = async (): Promise<ProductDoc> => {
  const adminId = new mongoose.Types.ObjectId().toHexString();

  const { body: product } = await request(app)
    .post('/api/products')
    .set('Cookie', global.adminSignin(adminId))
    .send({
      title: 'Sample Dress',
      price: 99,
      userId: adminId,
      image1: './asset/sample.jpg',
      colors: 'White,Black',
      sizes: 'S,M,L',
      brand: 'Uniqlo',
      category: 'Dress',
      material: 'Polyester 100%',
      description:
        'Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
      numReviews: 0,
      rating: 0,
      countInStock: 12
    });
  return product;
};

it('returns a 404 if the provided id does NOT exist', async () => {
  const anotherProductId = new mongoose.Types.ObjectId().toHexString();

  // Create a product
  await createProduct();

  await request(app)
    .patch(`/api/products/${anotherProductId}`)
    .set('Cookie', global.adminSignin())
    .send({
      title: 'Sample Skirt',
      price: 69
    })
    .expect(404);
});

it('returns a 401 if the user is NOT signing in', async () => {
  // Create a product
  const product = await createProduct();

  await request(app)
    .patch(`/api/products/${product.id as string}`)
    .send({
      title: 'Sample Skirt',
      price: 69
    })
    .expect(401);
});

it('returns a 401 if the user is NOT authenticated as an admin', async () => {
  // Create a product
  const product = await createProduct();

  await request(app)
    .patch(`/api/products/${product.id as string}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Sample Skirt',
      price: 69
    })
    .expect(401);
});

it('updates the product provided valid inputs as an admin', async () => {
  const cookie = global.adminSignin();

  // Create a product
  const product = await createProduct();

  await request(app)
    .patch(`/api/products/${product.id as string}`)
    .set('Cookie', cookie)
    .send({
      title: 'New Sample Cloth',
      price: 119
    })
    .expect(200);

  const { body: productResponse } = await request(app)
    .get(`/api/products/${product.id as string}`)
    .send();

  expect(productResponse.title).toEqual('New Sample Cloth');
  expect(productResponse.price).toEqual(119);
});

it('publishes an event', async () => {
  const cookie = global.adminSignin();

  // Create a product
  const product = await createProduct();

  await request(app)
    .patch(`/api/products/${product.id as string}`)
    .set('Cookie', cookie)
    .send({
      title: 'Sample Dress 2',
      price: 79,
      userId: product.userId,
      image1: './asset/sample.jpg',
      colors: 'White,Black,Red',
      sizes: 'S,M,L,XL',
      category: 'Dress',
      material: 'Cotton 70% Polyester 30%',
      description:
        'Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
      numReviews: 2,
      rating: 4.5,
      countInStock: 6
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it('rejects updates if the product is reserved', async () => {
  const cookie = global.adminSignin();

  // Create a product
  const product = await createProduct();

  const reservedProduct = await Product.findById(product.id);
  reservedProduct!.set({ isReserved: true });
  await reservedProduct!.save();

  // Reject an update when product has isReserved equal to true
  await request(app)
    .patch(`/api/products/${product.id as string}`)
    .set('Cookie', cookie)
    .send({
      price: 119
    })
    .expect(400);
});
