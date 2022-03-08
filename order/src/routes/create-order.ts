import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";
import { Cart } from "../models/cart";
import { Product } from "../models/product";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("jsonCartItems")
      .not()
      .isEmpty()
      .withMessage("CartItems must be provided"),
    body("jsonShippingAddress")
      .not()
      .isEmpty()
      .withMessage("Shipping Address must be provided"),
    body("jsonPaymentMethod")
      .not()
      .isEmpty()
      .withMessage("Payment Method must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = req.body;

    interface CartInterface {
      userId: string;
      title: string;
      qty: number;
      image: string;
      price: number;
      countInStock: number;
      discount: number;
      productId: string;
    }

    // Calculate an expiration date for this order
    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Create shippingAddress
    const cartItems: Array<CartInterface> = JSON.parse(jsonCartItems);

    // Convert JSON to javascript object
    const shippingAddress = JSON.parse(jsonShippingAddress);
    const paymentMethod = JSON.parse(jsonPaymentMethod);

    // Find reserve product in cart
    for (let i = 0; i < cartItems.length; i++) {
      // Find the product that the order is reserving
      const reservedProduct = await Product.find({
        id: cartItems[i].productId,
        isReserved: true,
      });

      const existedProduct = await Product.find({
        id: cartItems[i].productId,
      });

      // If reservedProduct existed, throw an error
      if (reservedProduct && reservedProduct.length !== 0) {
        throw new Error(`${cartItems[i].title} is already reserved`);
      }

      // If existedProduct DO NOT existed, throw an error
      if (!existedProduct || existedProduct.length === 0) {
        throw new NotFoundError();
      }
    }

    // Calculate discount factor
    const shippingDiscount = 1;

    // Calculate price
    const itemsPrice = cartItems.reduce(
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
      cart: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
    await order.save();

    // let cartItems = [];
    // for (let i = 0; i < items.length; i++) {
    //   const cartItem = {
    //     title: items[i].title,
    //     qty: items[i].qty,
    //     image: items[i].image,
    //     price: items[i].price,
    //     discount: items[i].discount,
    //     productId: items[i].productId,
    //   };
    //   cartItems.push(cartItem);
    // }

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: cartItems,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });

    // Delete item from cart
    await Cart.deleteMany({ userId: req.currentUser!.id });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
