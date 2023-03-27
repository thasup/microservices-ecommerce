import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@thasup-dev/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';
import type { OrderDoc } from '../../types/order';

// jest.mock("../stripe");

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

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'randomToken',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  // Create and save a product
  const order = await setup();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'randomToken',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a product
  const order = await setup(userId);

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'randomToken',
      orderId: order.id
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create product and order
  const order = await setup(userId);

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(order.totalPrice * 100);
  // expect(chargeOptions.currency).toEqual("usd");

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === order.totalPrice * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });

  expect(payment).not.toBeNull();
});
