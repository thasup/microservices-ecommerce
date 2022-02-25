import { Publisher, OrderCreatedEvent, Subjects } from "@thasup-dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
