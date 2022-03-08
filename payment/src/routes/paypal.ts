import express, { Request, Response } from "express";
import { requireAuth } from "@thasup-dev/common";

const router = express.Router();

router.get(
  "/api/config/paypal",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = process.env.PAYPAL_CLIENT_ID;
    res.status(200).send("hello worlddd?");
  }
);

export { router as paypalRouter };
