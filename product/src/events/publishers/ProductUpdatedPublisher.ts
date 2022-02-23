import { ProductUpdatedEvent, Publisher, Subjects } from "@thasup-dev/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
