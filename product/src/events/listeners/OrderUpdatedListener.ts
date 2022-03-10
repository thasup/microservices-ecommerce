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
      // Do nothing, just ack the message
      return msg.ack();
    }

    const items = data.cart;

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

      // Increase the product quantity in stock by return quantity from the cancelled order
      const countInStock = product.countInStock + items[i].qty;

      // Declare orderId variable outside the scope
      let orderId = product.orderId;

      // If product already reserved
      if (product.countInStock === 0 && product.isReserved === true) {
        // Cancelled reserved  product
        orderId = undefined;

        // Mark the product as avaliable by setting its orderId property
        // and return quantity in stock to previous state
        product.set({
          orderId: undefined,
          countInStock: countInStock,
          isReserved: false,
        });

        // Save the product
        await product.save();
      }

      // If the product still have some stock left (isReserved is still false)
      else {
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
        countInStock: countInStock,
        isReserved: product.isReserved,
        version: product.version,
        orderId: orderId,
      });
    }

    // ack the message
    msg.ack();
  }
}
