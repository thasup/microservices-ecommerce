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
    const items = data.cart;

    if (items!.length === 0) {
      // ack the message
      return msg.ack();
    }

    if (!items) {
      throw new Error("Cart not found");
    }

    for (let i = 0; i < items.length; i++) {
      // Find the product that the order is reserving
      const product = await Product.findById(items[i].productId);

      // If no product, throw error
      if (!product) {
        throw new Error("Product not found");
      }

      // Decrease the product quantity in stock
      const countInStock = product.countInStock - items[i].qty;

      // If the product has been sold out of stock
      if (countInStock === 0) {
        // Mark the product as being reserved by setting its isReserved property
        product.set({
          countInStock: countInStock,
          isReserved: true,
        });

        // Save the product
        await product.save();
      } else {
        product.set({ countInStock: countInStock });

        // Save the product
        await product.save();
      }

      await new ProductUpdatedPublisher(this.client).publish({
        id: product.id,
        price: product.price,
        title: product.title,
        userId: product.userId,
        image: product.images.image1,
        colors: product.colors,
        sizes: product.sizes,
        brand: product.brand,
        category: product.category,
        material: product.material,
        description: product.description,
        numReviews: product.numReviews,
        rating: product.rating,
        countInStock: product.countInStock,
        isReserved: product.isReserved,
        version: product.version,
      });
    }

    // ack the message
    msg.ack();
  }
}
