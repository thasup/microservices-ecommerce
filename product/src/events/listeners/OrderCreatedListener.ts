import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  QueueGroupNames,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Product } from "../../models/product";
import { ProductUpdatedPublisher } from "../publishers/ProductUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PRODUCT_SERVICE;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the product that the order is reserving
    const product = await Product.findById(data.product.id);

    // If no product, throw error
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.countInStock !== 1) {
      msg.ack();
    }

    // Mark the product as being reserved by setting its orderId property
    product.set({ orderId: data.id });

    // Save the product
    await product.save();

    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      price: product.price,
      title: product.title,
      userId: product.userId,
      image: product.image,
      colors: product.colors,
      sizes: product.sizes,
      brand: product.brand,
      category: product.category,
      material: product.material,
      description: product.description,
      numReviews: product.numReviews,
      rating: product.rating,
      countInStock: product.countInStock,
      orderId: product.orderId,
      version: product.version,
    });

    // ack the message
    msg.ack();
  }
}
