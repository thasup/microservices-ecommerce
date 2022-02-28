import { Message } from "node-nats-streaming";
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
  queueGroupName = QueueGroupNames.PAYMENT_SERVICE;

  async onMessage(data: ProductDeletedEvent["data"], msg: Message) {
    const product = await Product.findByEvent(data);

    if (!product) {
      throw new NotFoundError();
    }

    await product.remove();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
