import mongoose from "mongoose";
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  QueueGroupNames,
  NotFoundError,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { Product } from "../../models/product";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const product = await Product.findById(data.product.id);

    // const product = Product.build({
    //   id: data.product.id,
    //   title: data.product.title,
    //   price: data.product.price,
    //   image: data.product.image,
    //   colors: data.product.colors,
    //   sizes: data.product.sizes,
    //   countInStock: data.product.countInStock,
    // });
    // await product.save();

    if (!product) {
      throw new NotFoundError();
    }

    console.log("thasup y", product);

    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      product: product,
    });

    // order.populate("product");
    await order.save();

    console.log("thasup z", order);
    // ack the message
    msg.ack();
  }
}
