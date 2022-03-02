import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";
import { Cart } from "../models/cart";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("productId").not().isEmpty().withMessage("ProductId must be provided"),
    body("shippingAddress")
      .not()
      .isEmpty()
      .withMessage("shippingAddress must be provided"),
    body("paymentMethod")
      .not()
      .isEmpty()
      .withMessage("paymentMethod must be provided"),
    body("productId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { productId, shippingAddress, paymentMethod } = req.body;

    // Find the product the user is trying to order in the database
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError();
    }

    // Make sure that this product is not already reserved
    // Check if the product has only 1 set. If true then run query
    // to look at all orders. Find an order where the product
    // is the product we just found *AND* thr orders status is *NOT* cancelled.
    // If we find an order from that means the product *IS* reserved
    if (product.countInStock === 1) {
      const existingOrder = await Order.findOne({
        product: product,
        status: {
          $in: [OrderStatus.Created, OrderStatus.Pending, OrderStatus.Complete],
        },
      });

      if (existingOrder) {
        throw new BadRequestError("Product is already reserved");
      }
    }

    // Calculate an expiration date for this order
    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Fetch items in cart
    const items = await Cart.find({ userId: req.currentUser!.id });
    console.log("ts items: ", items);

    // Calculate discount factor
    const shippingDiscount = 1;

    // Calculate price
    const itemsPrice = items.reduce(
      (acc, item) => acc + item.price * item.qty * item.discount,
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10 * shippingDiscount;
    const taxPrice = 0.07 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      cart: items,
      shippingAddress,
      paymentMethod,
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
