import mongoose from 'mongoose';

import { app } from './app';
import { OrderUpdatedListener } from './events/listeners/OrderUpdatedListener';
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsWrapper } from './NatsWrapper';

const start = async (): Promise<void> => {
  console.log('Starting...');
  if (process.env.JWT_KEY == null) {
    throw new Error('JWT_KEY must be defined');
  }
  if (process.env.MONGO_URI_PRODUCT == null) {
    throw new Error('JMONGO_URI_PRODUCT must be defined');
  }
  if (process.env.NATS_CLIENT_ID == null) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (process.env.NATS_URL == null) {
    throw new Error('NATS_URL must be defined');
  }
  if (process.env.NATS_CLUSTER_ID == null) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => { natsWrapper.client.close(); });
    process.on('SIGTERM', () => { natsWrapper.client.close(); });

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI_PRODUCT);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`Product server: Listening on port ${port}`);
  });
};

void start();
