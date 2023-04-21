import Queue from 'bull';

import { ExpirationCompletedPublisher } from '../events/publishers/ExpirationCompletedPublisher';
import { natsWrapper } from '../NatsWrapper';

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

void expirationQueue.process(async (job) => {
  const publisher = new ExpirationCompletedPublisher(natsWrapper.client);
  await publisher.publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
