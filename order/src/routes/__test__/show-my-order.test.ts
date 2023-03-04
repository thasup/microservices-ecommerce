import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import type { ShippingAddressAttrs, CartAttrs } from '../../types/order';
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

it('fetches all orders for admin by himself', async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const userOne = global.signin(userOneId);
  const userTwo = global.signin(userTwoId);
  const admin = global.adminSignin();

  const {
    cart: cartUserOne,
    shippingAddress: shippingAddressUserOne,
    paymentMethod: paymentMethodUserOne
  } = buildPayload(productOne, userOneId);

  console.log({ cartUserOne, shippingAddressUserOne, paymentMethodUserOne });

  const {
    cart: cartUserTwoOrderOne,
    shippingAddress: shippingAddressUserTwoOrderOne,
    paymentMethod: paymentMethodUserTwoOrderOne
  } = buildPayload(productTwo, userTwoId);

  const {
    cart: cartUserTwoOrderTwo,
    shippingAddress: shippingAddressUserTwoOrderTwo,
    paymentMethod: paymentMethodUserTwoOrderTwo
  } = buildPayload(productThree, userTwoId);

  // Create one order as User #1
  try {
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({
        cart: cartUserOne,
        shippingAddress: shippingAddressUserOne,
        paymentMethod: paymentMethodUserOne
      })
      .expect(201);
  } catch (e) {
    console.log('error :', e);
  }

  // Create two orders as User #2
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderOne,
      shippingAddress: shippingAddressUserTwoOrderOne,
      paymentMethod: paymentMethodUserTwoOrderOne
    })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderTwo,
      shippingAddress: shippingAddressUserTwoOrderTwo,
      paymentMethod: paymentMethodUserTwoOrderTwo
    })
    .expect(201);

  // Make request to get all orders for ADMIN
  const response = await request(app)
    .get('/api/orders/myorders')
    .set('Cookie', admin)
    .expect(200);

  expect(response.body.length).toEqual(0);
});

it('fetches all orders for an particular user by the user himself', async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const userOne = global.signin(userOneId);
  const userTwo = global.signin(userTwoId);

  const {
    cart: cartUserOne,
    shippingAddress: shippingAddressUserOne,
    paymentMethod: paymentMethodUserOne
  } = buildPayload(productOne, userOneId);

  const {
    cart: cartUserTwoOrderOne,
    shippingAddress: shippingAddressUserTwoOrderOne,
    paymentMethod: paymentMethodUserTwoOrderOne
  } = buildPayload(productTwo, userTwoId);

  const {
    cart: cartUserTwoOrderTwo,
    shippingAddress: shippingAddressUserTwoOrderTwo,
    paymentMethod: paymentMethodUserTwoOrderTwo
  } = buildPayload(productThree, userTwoId);

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      cart: cartUserOne,
      shippingAddress: shippingAddressUserOne,
      paymentMethod: paymentMethodUserOne
    })
    .expect(201);

  // Create two orders as User #2
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderOne,
      shippingAddress: shippingAddressUserTwoOrderOne,
      paymentMethod: paymentMethodUserTwoOrderOne
    })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderTwo,
      shippingAddress: shippingAddressUserTwoOrderTwo,
      paymentMethod: paymentMethodUserTwoOrderTwo
    })
    .expect(201);

  // Make request to get orders for User #2 by himself
  const response = await request(app)
    .get('/api/orders/myorders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderTwo.id);
  expect(response.body[1].id).toEqual(orderThree.id);
  expect(response.body[0].cart[0].productId).toEqual(productTwo.id);
  expect(response.body[1].cart[0].productId).toEqual(productThree.id);
});

it('fetches all orders for an particular user by another user', async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const userOne = global.signin(userOneId);
  const userTwo = global.signin(userTwoId);

  const {
    cart: cartUserOne,
    shippingAddress: shippingAddressUserOne,
    paymentMethod: paymentMethodUserOne
  } = buildPayload(productOne, userOneId);

  const {
    cart: cartUserTwoOrderOne,
    shippingAddress: shippingAddressUserTwoOrderOne,
    paymentMethod: paymentMethodUserTwoOrderOne
  } = buildPayload(productTwo, userTwoId);

  const {
    cart: cartUserTwoOrderTwo,
    shippingAddress: shippingAddressUserTwoOrderTwo,
    paymentMethod: paymentMethodUserTwoOrderTwo
  } = buildPayload(productThree, userTwoId);

  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      cart: cartUserOne,
      shippingAddress: shippingAddressUserOne,
      paymentMethod: paymentMethodUserOne
    })
    .expect(201);

  // Create two orders as User #2
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderOne,
      shippingAddress: shippingAddressUserTwoOrderOne,
      paymentMethod: paymentMethodUserTwoOrderOne
    })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartUserTwoOrderTwo,
      shippingAddress: shippingAddressUserTwoOrderTwo,
      paymentMethod: paymentMethodUserTwoOrderTwo
    })
    .expect(201);

  // Make request to get orders for User #1 by himself
  const response = await request(app)
    .get('/api/orders/myorders')
    .set('Cookie', userOne)
    .expect(200);

  // Make sure we only got the orders for User #1
  expect(response.body.length).toEqual(1);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].cart[0].productId).toEqual(productOne.id);
});
