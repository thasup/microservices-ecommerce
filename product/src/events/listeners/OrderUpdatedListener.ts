import {
  Listener,
  type OrderUpdatedEvent,
  Subjects,
  QueueGroupNames
} from '@thasup-dev/common';
import { type Message } from 'node-nats-streaming';

import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/ProductUpdatedPublisher';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = QueueGroupNames.PRODUCT_SERVICE;

  async onMessage (data: OrderUpdatedEvent['data'], msg: Message): Promise<void> {
    // Check order status
    if (data.status !== 'cancelled') {
      // Do nothing, just ack the message
      msg.ack(); return;
    }

    const items = data.cart;

    if (items == null) {
      throw new Error('Cart not found');
    }

    for (let i = 0; i < items.length; i++) {
      // Find the product that the order is reserving
      const product = await Product.findById(items[i].productId);

      // If no product, throw error
      if (product == null) {
        throw new Error('Product not found');
      }

      // Increase the product quantity in stock by return quantity from the cancelled order
      const countInStock = product.countInStock + items[i].qty;

      // If product already reserved
      if (product.countInStock === 0 && product.isReserved) {
        // Mark the product as avaliable by setting its isReserved property
        // and return quantity in stock to previous state
        product.set({
          countInStock,
          isReserved: false
        });

        // Save the product
        await product.save();
      } else {
        // If the product still have some stock left (isReserved is still false)
        product.set({ countInStock });

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
        countInStock,
        isReserved: product.isReserved,
        version: product.version
      });
    }

    // ack the message
    msg.ack();
  }
}
