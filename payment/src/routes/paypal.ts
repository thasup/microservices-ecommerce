import express, { Request, Response } from "express";
import { requireAuth } from "@thasup-dev/common";

const router = express.Router();

router.get(
  "/api/config/paypal",
  requireAuth,
  async (req: Request, res: Response) => {
    res.status(200).send(process.env.PAYPAL_CLIENT_ID);
  }
);

export { router as paypalRouter };
