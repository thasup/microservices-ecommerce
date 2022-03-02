import { Publisher, OrderUpdatedEvent, Subjects } from "@thasup-dev/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
