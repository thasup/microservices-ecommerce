import { type Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  type ProductUpdatedEvent,
  NotFoundError,
  QueueGroupNames
} from '@thasup-dev/common';

import { Product } from '../../models/product';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage (data: ProductUpdatedEvent['data'], msg: Message): Promise<void> {
    const {
      title,
      price,
      image,
      colors,
      sizes,
      countInStock,
      numReviews,
      rating,
      isReserved
    } = data;

    const product = await Product.findByEvent(data);

    if (product == null) {
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
      isReserved
    });

    // Save and update version
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
