import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@thasup-dev/common';

import { Order } from '../models/order';
import { natsWrapper } from '../NatsWrapper';
import { OrderCreatedPublisher } from '../events/publishers/OrderCreatedPublisher';
import { Product } from '../models/product';
import type { OrderAttrs } from '../types/order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 30 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('cart')
      .not()
      .isEmpty()
      .withMessage('CartItems must be provided'),
    body('shippingAddress')
      .not()
      .isEmpty()
      .withMessage('Shipping Address must be provided'),
    body('paymentMethod')
      .not()
      .isEmpty()
      .withMessage('Payment Method must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { cart, shippingAddress, paymentMethod }: Partial<OrderAttrs> = req.body;

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    if (cart == null) {
      throw new Error('cart is empty');
    } else if (paymentMethod == null) {
      throw new Error('payment method is not provide');
    }

    // Find reserve product in cart
    for (let i = 0; i < cart.length; i++) {
      // Find the product that the order is reserving
      const reservedProduct = await Product.find({
        _id: cart[i].productId,
        isReserved: true
      });

      // Find the product if it exists in database
      const existedProduct = await Product.findById(cart[i].productId);

      // If reservedProduct existed, throw an error
      if (reservedProduct?.length > 0) {
        throw new Error(`${cart[i].title} is already reserved`);
      }

      // If existedProduct DO NOT existed, throw an error
      if (existedProduct == null) {
        throw new NotFoundError();
      }
    }

    // Calculate discount factor
    const shippingDiscount = 1;

    // Calculate price
    const itemsPrice = cart.reduce(
      (acc, item) => acc + item.price * item.qty * item.discount,
      0
    );
    const shippingPrice = itemsPrice > 100.0 ? 0.0 : 10.0 * shippingDiscount;
    const taxPrice = 0.07 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      cart,
      shippingAddress,
      paymentMethod,
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2))
    });

    await order.save();

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
