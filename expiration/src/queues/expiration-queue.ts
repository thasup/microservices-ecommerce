import Queue from "bull";
import { natsWrapper } from "../NatsWrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("publish an event", job.data.orderId);
});

export { expirationQueue };
