import { ProductDeletedEvent, Publisher, Subjects } from "@thasup-dev/common";

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
}
