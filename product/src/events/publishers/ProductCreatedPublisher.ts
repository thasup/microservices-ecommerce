import { ProductCreatedEvent, Publisher, Subjects } from "@thasup-dev/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
