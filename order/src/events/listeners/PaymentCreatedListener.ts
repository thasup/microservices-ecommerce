import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
  QueueGroupNames,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Completed,
    });
    await order.save();

    msg.ack();
  }
}
