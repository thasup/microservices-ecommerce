import http from 'http';

import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsWrapper } from './NatsWrapper';

const start = async (): Promise<void> => {
  console.log('Starting...');
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
  } catch (err) {
    console.error(err);
  }

  // Minimal HTTP server so Kubernetes probes can check this worker.
  const port = 3000;
  http
    .createServer((req, res) => {
      if (req.url === '/healthz') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } else {
        res.writeHead(404);
        res.end();
      }
    })
    .listen(port, () => {
      console.log(`Expiration server: Listening on port ${port}`);
    });
};

void start();
