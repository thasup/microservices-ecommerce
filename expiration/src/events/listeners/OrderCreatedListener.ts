import {
  Listener,
  type OrderCreatedEvent,
  QueueGroupNames,
  Subjects
} from '@thasup-dev/common';
import { type Message } from 'node-nats-streaming';

import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.EXPIRATION_SERVICE;

  async onMessage (data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay / (1000 * 60)} minutes to process the job`);

    await expirationQueue.add(
      {
        orderId: data.id
      },
      {
        delay
      }
    );

    msg.ack();
  }
}
