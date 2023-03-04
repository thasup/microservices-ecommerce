import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { natsWrapper } from '../../NatsWrapper';
import { OrderStatus } from '@thasup-dev/common';
import type { ProductDoc } from '../../types/product';
import type { CartAttrs, ShippingAddressAttrs } from '../../types/order';

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

const buildPayload = (product: ProductDoc, userId: string): {
  cart: CartAttrs[]
  shippingAddress: ShippingAddressAttrs
  paymentMethod: string
} => {
  const cart = [{
    userId,
    title: product.title,
    qty: 1,
    color: 'white',
    size: 'M',
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    discount: 1,
    productId: product.id
  }];

  const shippingAddress = {
    address: 'sunset villa',
    city: 'New York',
    postalCode: '44205',
    country: 'USA'
  };

  const paymentMethod = 'stripe';

  return { cart, shippingAddress, paymentMethod };
};

it('return 401 when trying to marks an order as delivered by user', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // make a request to mark the order as delivered
  await request(app)
    .patch(`/api/orders/${order.id as string}/deliver`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(401);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(false);
  expect(updatedOrder!.deliveredAt).toBeUndefined();
});

it('return 400 when trying to marks an unpaid order as delivered', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // make a request to mark the *UNPAID* order as delivered
  await request(app)
    .patch(`/api/orders/${order.id as string}/deliver`)
    .set('Cookie', global.adminSignin(userId))
    .send()
    .expect(400);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(false);
  expect(updatedOrder!.deliveredAt).toBeUndefined();
});

it('marks an order as delivered by admin', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // Change order status to be completed (paid an order)
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Completed,
    isPaid: true,
    paidAt: new Date()
  });
  await newOrder!.save();

  // make a request to mark the *PAID* order as delivered
  await request(app)
    .patch(`/api/orders/${order.id as string}/deliver`)
    .set('Cookie', global.adminSignin(userId))
    .send()
    .expect(200);

  // expectation to make sure the thing is delivered
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.isDelivered).toEqual(true);
  expect(updatedOrder!.deliveredAt).toBeDefined();
});

it('emits a order updated event', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  // Create  an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // Change order status to be completed (paid an order)
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Completed,
    isPaid: true,
    paidAt: new Date()
  });
  await newOrder!.save();

  // make a request to mark the order as delivered
  await request(app)
    .patch(`/api/orders/${order.id as string}/deliver`)
    .set('Cookie', global.adminSignin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
