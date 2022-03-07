import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProductCreatedEvent,
  QueueGroupNames,
} from "@thasup-dev/common";

import { Product } from "../../models/product";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ProductCreatedEvent["data"], msg: Message) {
    const { id, title, price, userId, image, colors, sizes, countInStock } =
      data;

    const product = Product.build({
      id,
      title,
      price,
      userId,
      image,
      colors,
      sizes,
      countInStock,
      orderId: "",
    });
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
