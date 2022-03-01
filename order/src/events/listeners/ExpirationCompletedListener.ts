import {
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  QueueGroupNames,
  Subjects,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("product");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      status: OrderStatus.Cancelled,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      product: {
        id: order.product.id,
        title: order.product.title,
        price: order.product.price,
        image: order.product.image,
        colors: order.product.colors,
        sizes: order.product.sizes,
        countInStock: order.product.countInStock,
      },
    });

    msg.ack();
  }
}
