import {
  Listener,
  OrderUpdatedEvent,
  Subjects,
  QueueGroupNames,
} from "@thasup-dev/common";
import { Message } from "node-nats-streaming";

import { Product } from "../../models/product";
import { ProductUpdatedPublisher } from "../publishers/ProductUpdatedPublisher";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = QueueGroupNames.PRODUCT_SERVICE;

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    // Check order status
    if (data.status !== "cancelled") {
      // ack the message
      msg.ack();
    }

    const items = data.cart;

    if (items!.length === 0) {
      // ack the message
      msg.ack();
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

      // Increase the product quantity in stock
      const countInStock = product.countInStock + items[i].qty;

      let orderId = product.orderId;
      if (product.countInStock === 0) {
        orderId = undefined;
        // Mark the product as avaliable by setting its orderId property
        product.set({ orderId: undefined, countInStock: countInStock });

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
        version: product.version,
        orderId: orderId,
      });
    }

    // ack the message
    msg.ack();
  }
}
