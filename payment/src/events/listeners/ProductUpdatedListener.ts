import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProductUpdatedEvent,
  NotFoundError,
  QueueGroupNames,
} from "@thasup-dev/common";

import { Product } from "../../models/product";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage(data: ProductUpdatedEvent["data"], msg: Message) {
    const {
      title,
      price,
      image,
      colors,
      sizes,
      countInStock,
      numReviews,
      rating,
      isReserved,
    } = data;

    const product = await Product.findByEvent(data);

    if (!product) {
      throw new NotFoundError();
    }

    product.set({
      title,
      price,
      image,
      colors,
      sizes,
      countInStock,
      numReviews,
      rating,
      isReserved,
    });

    // Save and update version
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
