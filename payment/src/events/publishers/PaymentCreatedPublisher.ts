import { Subjects, Publisher, type PaymentCreatedEvent } from '@thasup-dev/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
