import { Publisher, OrderCancelledEvent, Subjects } from "@thasup-dev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
