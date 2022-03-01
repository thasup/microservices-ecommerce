import { Subjects, Publisher, PaymentCreatedEvent } from "@thasup-dev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
