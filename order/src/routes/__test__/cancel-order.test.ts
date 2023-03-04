import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@thasup-dev/common';

import { app } from '../../app';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { natsWrapper } from '../../NatsWrapper';
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

it('marks an order as cancelled', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id as string}`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(200);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order updated event', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id as string}`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
