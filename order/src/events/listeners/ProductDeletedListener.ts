import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import {
  Subjects,
  Listener,
  ProductDeletedEvent,
  NotFoundError,
  QueueGroupNames,
} from "@thasup-dev/common";

import { Product } from "../../models/product";

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ProductDeletedEvent["data"], msg: Message) {
    let product;

    try {
      product = await Product.findByEvent(data);
    } catch (err) {
      console.log(err);
    }

    if (!product) {
      throw new NotFoundError();
    }

    await product.remove();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
