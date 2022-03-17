import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "@thasup-dev/common";

import { User } from "../models/user";

const router = express.Router();

router.delete(
  "/api/users/:userId",
  [param("userId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const deletedUser = await User.findById(req.params.userId);

    // Check if the user is existing
    if (!deletedUser) {
      throw new NotFoundError();
    }

    deletedUser.remove();

    res.status(200).send({});
  }
);

export { router as deleteUserRouter };
