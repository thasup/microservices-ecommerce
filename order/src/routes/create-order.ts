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

    console.log("RUN!!!!!!!!! 1");

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
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    console.log(typeof jsonCartItems);
    console.log(typeof jsonShippingAddress);
    console.log(typeof jsonPaymentMethod);

    console.log("RUN!!!!!!!!! 2");
    const cartItems: Array<CartInterface> = jsonCartItems;
    console.log("RUN!!!!!!!!! 3");

    // Convert JSON to javascript object
    const shippingAddress = jsonShippingAddress;
    const paymentMethod = jsonPaymentMethod;

    console.log("RUN!!!!!!!!! 4");
    // Find reserve product in cart
    for (let i = 0; i < cartItems.length; i++) {
      // Find the product that the order is reserving
      const reservedProduct = await Product.find({
        _id: cartItems[i].productId,
        isReserved: true,
      });
      console.log("RUN!!!!!!!!! 4.1", reservedProduct);

      const existedProduct = await Product.find({
        _id: cartItems[i].productId,
      });

      console.log("RUN!!!!!!!!! 4.2", existedProduct);
      // If reservedProduct existed, throw an error
      if (reservedProduct && reservedProduct.length !== 0) {
        throw new Error(`${cartItems[i].title} is already reserved`);
      }
      console.log("RUN!!!!!!!!! 4.3");

      // If existedProduct DO NOT existed, throw an error
      if (!existedProduct || existedProduct.length === 0) {
        throw new NotFoundError();
      }
      console.log("RUN!!!!!!!!! 4.4");
    }

    console.log("RUN!!!!!!!!! 5");
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

    console.log("RUN!!!!!!!!! 6");
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

    console.log("RUN!!!!!!!!! 7");
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
    console.log("RUN!!!!!!!!! 8");

    // Delete item from cart
    await Cart.deleteMany({ userId: req.currentUser!.id });

    console.log("RUN!!!!!!!!! 9");
    res.status(201).send({});
  }
);

export { router as createOrderRouter };
