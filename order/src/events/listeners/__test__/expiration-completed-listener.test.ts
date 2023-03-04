import mongoose from 'mongoose';
import { type Message } from 'node-nats-streaming';
import { OrderStatus, type ExpirationCompletedEvent } from '@thasup-dev/common';
import { ExpirationCompletedListener } from '../ExpirationCompletedListener';
import { natsWrapper } from '../../../NatsWrapper';
import { Order } from '../../../models/order';
import { Product } from '../../../models/product';
import { type OrderDoc } from '../../../types/order';
import { type ProductDoc } from '../../../types/product';

const setup = async (): Promise<{
  listener: any
  order: OrderDoc
  product: ProductDoc
  data: {
    orderId: string
  }
  msg: Message
}> => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

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

  const itemsPrice = parseFloat(product.price.toFixed(2));
  const taxPrice = parseFloat((product.price * 0.07).toFixed(2));

  const order = Order.build({
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    paymentMethod: 'stripe',
    itemsPrice,
    shippingPrice: 0.0,
    taxPrice,
    totalPrice: itemsPrice + taxPrice
  });

  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, product, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
