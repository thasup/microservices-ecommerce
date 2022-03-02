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
    // Find the product that the order is reserving
    const order = await Order.findByEvent(data);

    // If no order, throw error
    if (!order) {
      throw new Error("Order not found");
    }

    // Mark the product as being reserved by setting its orderId property
    order.set({ status: OrderStatus.Cancelled });

    // Save the product
    await order.save();

    // ack the message
    msg.ack();
  }
}
