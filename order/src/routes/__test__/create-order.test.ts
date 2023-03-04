import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import { natsWrapper } from '../../NatsWrapper';
import type { CartAttrs, ShippingAddressAttrs } from '../../types/order';
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

it('returns an error if some product in cart does not exist', async () => {
  // @ts-ignore
  const product: ProductDoc = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Sample Dress',
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: './asset/sample.jpg',
    colors: 'White,Black',
    sizes: 'S,M,L',
    countInStock: 1,
    isReserved: false
  };

  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(404);
});

it('returns an error if the product is already reserved', async () => {
  // Only one product
  const product = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const {
    cart: cartItemsUserOne,
    shippingAddress: shippingAddressUserOne,
    paymentMethod: paymentMethodUserOne
  } = buildPayload(product, userOneId);

  const {
    cart: cartItemsUserTwo,
    shippingAddress: shippingAddressUserTwo,
    paymentMethod: paymentMethodUserTwo
  } = buildPayload(product, userTwoId);

  // Reserved the product
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userOneId))
    .send({
      cart: cartItemsUserOne,
      shippingAddress: shippingAddressUserOne,
      paymentMethod: paymentMethodUserOne
    })
    .expect(201);

  const updatedProduct = await Product.findById(product.id);
  updatedProduct!.set({
    isReserved: true,
    countInStock:
      product.countInStock - cartItemsUserOne[0].qty
  });
  await updatedProduct!.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userTwoId))
    .send({
      cart: cartItemsUserTwo,
      shippingAddress: shippingAddressUserTwo,
      paymentMethod: paymentMethodUserTwo
    })
    .expect(400);

  console.log();

  expect(updatedProduct?.isReserved).toEqual(true);
  expect(updatedProduct?.countInStock).toEqual(0);
});

it('reserves a product', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);
});

it('emits an order created event', async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { cart, shippingAddress, paymentMethod } = buildPayload(
    product,
    userId
  );

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId))
    .send({
      cart,
      shippingAddress,
      paymentMethod
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
