import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { Cart } from "../models/cart";

const router = express.Router();

router.post(
  "/api/orders/:productId/cart",
  requireAuth,
  [
    body("qty").not().isEmpty().withMessage("Qty is required"),
    param("productId").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { qty, discount } = req.body;

    // Check the product is existing
    const product = await Product.findById(req.params.productId);

    if (!product) {
      throw new NotFoundError();
    }

    // Calculate discount factor
    let discountFactor: number;

    switch (discount) {
      case "FREE":
        discountFactor = 0;
        break;
      case "GRANDSALE":
        discountFactor = 0.5;
        break;
      case "HOTDEAL":
        discountFactor = 0.75;
        break;
      default:
        discountFactor = 1;
    }

    // Add item to cart
    const cart = Cart.build({
      userId: req.currentUser!.id,
      title: product.title,
      qty,
      image: product.image,
      price: product.price,
      discount: discountFactor,
      product,
    });

    await cart.save();

    res.status(201).send(cart);
  }
);

export { router as addToCartRouter };
