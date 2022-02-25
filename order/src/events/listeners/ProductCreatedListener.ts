import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductCreatedEvent } from "@thasup-dev/common";
import { Product } from "../../models/product";
import { queueGroupName } from "./queue-group-name";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent["data"], msg: Message) {
    const { id, title, price, image, colors, sizes, countInStock } = data;

    const product = Product.build({
      id,
      title,
      price,
      image,
      colors,
      sizes,
      countInStock,
    });
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
