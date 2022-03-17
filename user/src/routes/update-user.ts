import express, { Request, Response } from "express";
import { param } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@thasup-dev/common";
import { User } from "../models/user";
import { Password } from "../services/Password";

const router = express.Router();

router.patch(
  "/api/users/:userId",
  [param("userId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      isAdmin,
      name,
      image,
      gender,
      age,
      bio,
      jsonShippingAddress,
    } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (password && password !== "") {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        throw new BadRequestError("Invalid credentials");
      }

      const passwordMatch = await Password.compare(
        existingUser.password,
        password
      );

      if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials");
      }
    }

    let shippingAddress; //่JSON
    if (typeof jsonShippingAddress === "string") {
      shippingAddress = await JSON.parse(jsonShippingAddress);
    } else if (typeof jsonShippingAddress === "object") {
      shippingAddress = jsonShippingAddress;
    }

    user.set({
      email: email ?? user.email,
      password: password ?? user.password,
      isAdmin: isAdmin ?? user.isAdmin,
      name: name ?? user.name,
      image: image ?? user.image,
      gender: gender ?? user.gender,
      age: age ?? user.age,
      bio: bio ?? user.bio,
      shippingAddress: shippingAddress ?? user.shippingAddress,
    });

    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email,
        isAdmin,
        name,
        image,
        gender,
        age,
        bio,
        shippingAddress,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.send(user);
  }
);

export { router as updateUserRouter };
