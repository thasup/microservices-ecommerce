import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it('returns the product if the product is found', async () => {
  const title = 'Sample Dress';
  const price = 1990;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.adminSignin())
    .send({
      title,
      price,
      userId: '6214a0227e0d2db80ddb0860',
      image1: './asset/sample.jpg',
      colors: 'White,Black',
      sizes: 'S,M,L',
      brand: 'Uniqlo',
      category: 'Dress',
      material: 'Polyester 100%',
      description:
        'Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
      numReviews: 0,
      rating: 5,
      countInStock: 12
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id as string}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
});
