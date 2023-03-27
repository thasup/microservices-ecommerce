import {
  Listener,
  type OrderCreatedEvent,
  Subjects,
  QueueGroupNames
} from '@thasup-dev/common';
import { type Message } from 'node-nats-streaming';

import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage (data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    // Build an order
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      paymentMethod: data.paymentMethod,
      itemsPrice: data.itemsPrice,
      shippingPrice: data.shippingPrice,
      taxPrice: data.taxPrice,
      totalPrice: data.totalPrice
    });

    await order.save();

    // ack the message
    msg.ack();
  }
}
