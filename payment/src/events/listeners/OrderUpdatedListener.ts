import {
  Listener,
  OrderUpdatedEvent,
  Subjects,
  QueueGroupNames,
  OrderStatus,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data).catch((err) =>
      console.log(err)
    );

    // If no order, throw error
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.isPaid) {
      order.set({
        status: data.status,
        isPaid: data.isPaid,
        paidAt: data.paidAt,
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
