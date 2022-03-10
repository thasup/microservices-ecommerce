import express, { Request, Response } from "express";
import { adminUser, NotFoundError, requireAuth } from "@thasup-dev/common";

import { User } from "../models/user";

const router = express.Router();

router.get("/api/users", async (req: Request, res: Response) => {
  const users = await User.find({});

  if (!users) {
    throw new NotFoundError();
  }

  res.status(200).send(users);
});

export { router as showUserRouter };
