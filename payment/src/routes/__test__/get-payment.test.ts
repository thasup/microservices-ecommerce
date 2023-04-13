import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@thasup-dev/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import type { OrderDoc } from '../../types/order';

const setup = async (userId?: string): Promise<OrderDoc> => {
  const price = Math.floor(Math.random() * 100000);

  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Sample Dress',
    price,
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

  const itemsPrice = Math.floor(parseFloat(product.price.toFixed(2)));
  const taxPrice = Math.floor(parseFloat((product.price * 0.07).toFixed(2)));

  // Create and save the order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: userId ?? new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    paymentMethod: 'stripe',
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice
  });
  await order.save();

  return order;
};

it('returns 404 if there is no order with that id', async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/payments/${randomId}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404);
});

it('returns 201 if user does not have authorization', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const anotherUserId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a product
  const order = await setup(userId);

  // Get the payment with another user id
  await request(app)
    .get(`/api/payments/${order.id as string}`)
    .set('Cookie', global.signin(anotherUserId))
    .send({})
    .expect(401);
});

it('returns 200 if the payment has found', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a product
  const order = await setup(userId);

  // Create the payment
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  // Get the payment
  const { body: fetchedPayment } = await request(app)
    .get(`/api/payments/${order.id as string}`)
    .set('Cookie', global.signin(userId))
    .send({})
    .expect(200);

  expect(fetchedPayment[0]).toBeDefined();
  expect(fetchedPayment[0].orderId).toEqual(order.id);
});
