import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';
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

it('fetches all orders by admin', async () => {
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
    cart: cartItemsUserOne,
    shippingAddress: shippingAddressUserOne,
    paymentMethod: paymentMethodUserOne
  } = buildPayload(productOne, userOneId);

  const {
    cart: cartItemsUserTwoOrderOne,
    shippingAddress: shippingAddressUserTwoOrderOne,
    paymentMethod: paymentMethodUserTwoOrderOne
  } = buildPayload(productTwo, userTwoId);

  const {
    cart: cartItemsUserTwoOrderTwo,
    shippingAddress: shippingAddressUserTwoOrderTwo,
    paymentMethod: paymentMethodUserTwoOrderTwo
  } = buildPayload(productThree, userTwoId);

  // Create one order as User #1
  const { body: orderOneForUserOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      cart: cartItemsUserOne,
      shippingAddress: shippingAddressUserOne,
      paymentMethod: paymentMethodUserOne
    })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOneForUserTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartItemsUserTwoOrderOne,
      shippingAddress: shippingAddressUserTwoOrderOne,
      paymentMethod: paymentMethodUserTwoOrderOne
    })
    .expect(201);

  const { body: orderTwoForUserTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      cart: cartItemsUserTwoOrderTwo,
      shippingAddress: shippingAddressUserTwoOrderTwo,
      paymentMethod: paymentMethodUserTwoOrderTwo
    })
    .expect(201);

  // Make request to get all orders by *ADMIN*
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', admin)
    .expect(200);

  // Make sure we got all orders for admin
  expect(response.body.length).toEqual(3);
  expect(response.body[0].id).toEqual(orderOneForUserOne.id);
  expect(response.body[1].id).toEqual(orderOneForUserTwo.id);
  expect(response.body[2].id).toEqual(orderTwoForUserTwo.id);
  expect(response.body[0].cart[0].productId).toEqual(productOne.id);
  expect(response.body[1].cart[0].productId).toEqual(productTwo.id);
  expect(response.body[2].cart[0].productId).toEqual(productThree.id);
});
