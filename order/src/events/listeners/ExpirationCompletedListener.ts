import {
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  QueueGroupNames,
  Subjects,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { OrderUpdatedPublisher } from "../publishers/OrderUpdatedPublisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("product");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderUpdatedPublisher(this.client).publish({
      id: order.id,
      status: OrderStatus.Cancelled,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });

    msg.ack();
  }
}
