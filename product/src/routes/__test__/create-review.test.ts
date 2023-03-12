import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import { natsWrapper } from '../../NatsWrapper';
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

it('return 404 when the product data is not found', async () => {
  // Create a product
  await createProduct();

  const anotherProductId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request
  await request(app)
    .post(`/api/products/${anotherProductId}/reviews`)
    .set('Cookie', global.signin())
    .send({
      title: 'Good Quality',
      rating: 5,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(404);
});

it('return 400 if it does not have a title', async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request without sign in
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin(userId))
    .send({
      title: '',
      rating: 3,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(400);
});

it('return 400 if it does not have a comment', async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request without sign in
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin(userId))
    .send({
      title: 'Good Quality',
      rating: 3,
      comment: ''
    })
    .expect(400);
});

it('return 400 if rating is lesser than 1', async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request without sign in
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin(userId))
    .send({
      title: 'Good Quality',
      rating: 0,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(400);
});

it('return 401 when make a request without signed in', async () => {
  // Create a product
  const product = await createProduct();

  // Make a post request without sign in
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .send({
      title: 'Good Quality',
      rating: 5,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(401);
});

it('return 400 when make a request by the same user', async () => {
  // Create a product
  const product = await createProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request for first time
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin(userId))
    .send({
      title: 'Great Quality',
      rating: 5,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(201);

  // Make a post request by the same user
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin(userId))
    .send({
      title: 'Poor Quality',
      rating: 2,
      comment: 'Elit sed vulputate mi sit amet mauris commodo quis imperdiet.'
    })
    .expect(400);
});

it('return 201 when make a successful request', async () => {
  // Create a product
  const product = await createProduct();

  // Make a post request
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin())
    .send({
      title: 'Good Quality',
      rating: 5,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(201);

  // Find the updated product
  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct).toBeDefined();
  expect(updatedProduct!.numReviews).toEqual(1);
  expect(updatedProduct!.reviews!.length).toEqual(1);
  expect(updatedProduct!.reviews![0].title).toEqual('Good Quality');
  expect(updatedProduct!.reviews![0].rating).toEqual(5);
  expect(updatedProduct!.reviews![0].comment).toEqual(
    'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
  );
  expect(updatedProduct!.reviews![0].productTitle).toEqual(product.title);
  expect(updatedProduct!.reviews![0].productId).toEqual(product.id);
});

it('update new rating and numReviews correctly when recieve new several request', async () => {
  // Create a product
  const product = await createProduct();

  // Create a 1st review
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin())
    .send({
      title: 'Good Quality',
      rating: 4,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(201);

  // Create a 2nd review
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin())
    .send({
      title: 'Love It!',
      rating: 5,
      comment: 'Elit sed vulputate mi sit amet mauris commodo quis imperdiet.'
    })
    .expect(201);

  // Find the updated product
  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct).toBeDefined();
  expect(updatedProduct!.rating).toEqual(4.5);
  expect(updatedProduct!.numReviews).toEqual(2);
  expect(updatedProduct!.reviews!.length).toEqual(2);
  expect(updatedProduct!.reviews![0].title).toEqual('Good Quality');
  expect(updatedProduct!.reviews![1].title).toEqual('Love It!');
});

it('publishes an event', async () => {
  // Create a product
  const product = await createProduct();

  // Make a post request
  await request(app)
    .post(`/api/products/${product.id as string}/reviews`)
    .set('Cookie', global.signin())
    .send({
      title: 'Good Quality',
      rating: 5,
      comment:
        'Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.'
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
