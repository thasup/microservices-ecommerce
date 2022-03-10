import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@thasup-dev/common";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("name").not().isEmpty().withMessage("Name is required"),
    body("gender").not().isEmpty().withMessage("Gender is required"),
    body("age").isInt().not().isEmpty().withMessage("Age is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      isAdmin,
      name,
      gender,
      age,
      bio,
      jsonShippingAddress,
    } = req.body;
    let { image } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    if (!image || image === "") {
      image = `https://joeschmoe.io/api/v1/${gender}/${name}${email}`;
    }

    const user = User.build({
      email,
      password,
      isAdmin,
      name,
      image,
      gender,
      age,
      bio,
      shippingAddress: jsonShippingAddress,
    });
    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name,
        image,
        gender,
        age,
        bio,
        shippingAddress: jsonShippingAddress,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
