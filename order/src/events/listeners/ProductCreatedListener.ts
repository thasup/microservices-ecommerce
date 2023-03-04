import { type Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  type ProductCreatedEvent,
  QueueGroupNames
} from '@thasup-dev/common';

import { Product } from '../../models/product';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage (data: ProductCreatedEvent['data'], msg: Message): Promise<void> {
    const {
      id,
      title,
      price,
      userId,
      image,
      colors,
      sizes,
      countInStock,
      numReviews,
      rating
    } = data;

    const product = Product.build({
      id,
      title,
      price,
      userId,
      image,
      colors,
      sizes,
      countInStock,
      numReviews,
      rating,
      isReserved: false
    });
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
