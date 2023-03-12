import { type Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { type OrderCreatedEvent, OrderStatus } from '@thasup-dev/common';

import { OrderCreatedListener } from '../OrderCreatedListener';
import { Product } from '../../../models/product';
import { natsWrapper } from '../../../NatsWrapper';
import type { ProductDoc } from '../../../types/product';
import type { OrderDoc } from '../../../types/order';

const setup = async (): Promise<{
  listener: any
  product: ProductDoc
  data: Partial<OrderDoc>
  msg: Message
}> => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    title: 'Sample Dress',
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    images: {
      image1: './asset/sample.jpg'
    },
    colors: 'White,Black',
    sizes: 'S,M,L',
    brand: 'Uniqlo',
    category: 'Dress',
    material: 'Polyester 100%',
    description:
      'Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
    numReviews: 0,
    rating: 0,
    countInStock: 3,
    isReserved: false
  });
  await product.save();

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: product.userId,
    expiresAt: new Date(),
    cart: [
      {
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: product.title,
        qty: 3,
        color: 'white',
        size: 'M',
        image: product.images.image1,
        price: product.price,
        countInStock: 5,
        discount: 1,
        productId: product.id
      }
    ],
    paymentMethod: 'stripe',
    itemsPrice,
    shippingPrice: 0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, product, data, msg };
};

it('sets isReserved property of the product', async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.isReserved).toEqual(true);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a product updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const productUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(productUpdatedData.isReserved).toEqual(true);
});
