import request from 'supertest';

import { app } from '../../app';
import type { ProductDoc } from '../../types/product';

const createProduct = async (): Promise<ProductDoc> => {
  const { body: product } = await request(app)
    .post('/api/products')
    .set('Cookie', global.adminSignin())
    .send({
      title: 'sample',
      price: 20,
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
    });

  return product;
};

it('can fetch a list of products', async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get('/api/products').send().expect(200);

  expect(response.body.length).toEqual(3);
});
