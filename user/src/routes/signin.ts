import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@thasup-dev/common";

import { User } from "../models/user";
import { Password } from "../services/Password";
import { UserAttrs } from "../types/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: Partial<UserAttrs>  = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const isMatch = await Password.compare(
      existingUser.password,
      password!
    );

    if (!isMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        name: existingUser.name,
        image: existingUser.image,
        gender: existingUser.gender,
        age: existingUser.age,
        bio: existingUser.bio,
        shippingAddress: existingUser.shippingAddress,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
