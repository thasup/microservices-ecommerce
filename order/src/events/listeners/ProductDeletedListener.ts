import { type Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  type ProductDeletedEvent,
  NotFoundError,
  QueueGroupNames
} from '@thasup-dev/common';

import { Product } from '../../models/product';

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage (data: ProductDeletedEvent['data'], msg: Message): Promise<void> {
    const product = await Product.findByEvent(data);

    if (product == null) {
      throw new NotFoundError();
    }

    await product.remove();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
