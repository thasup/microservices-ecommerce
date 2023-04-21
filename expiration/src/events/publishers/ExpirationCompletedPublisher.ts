import {
  Subjects,
  Publisher,
  type ExpirationCompletedEvent
} from '@thasup-dev/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
