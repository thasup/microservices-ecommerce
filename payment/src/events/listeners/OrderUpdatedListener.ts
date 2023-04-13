import {
  Listener,
  type OrderUpdatedEvent,
  Subjects,
  QueueGroupNames,
  OrderStatus
} from '@thasup-dev/common';
import { type Message } from 'node-nats-streaming';

import { Order } from '../../models/order';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage (data: OrderUpdatedEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findByEvent(data);

    // If no order, throw error
    if (order == null) {
      throw new Error('Order not found');
    }

    if (order.isPaid === true) {
      order.set({
        status: data.status,
        isPaid: data.isPaid,
        paidAt: data.paidAt
      });
    } else {
      // Mark the order as being cancelled by setting its status property
      order.set({ status: OrderStatus.Cancelled });
    }

    // Save the order
    await order.save();

    // ack the message
    msg.ack();
  }
}
