import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  NotFoundError,
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
      newPassword,
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
      const existingUser = await User.findOne({ name });

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
      email: email !== "" ? email : user.email,
      password: newPassword ? newPassword : password ?? user.password,
      isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin,
      name: name !== "" ? name : user.name,
      image: image !== "" ? image : user.image,
      gender: gender !== "" ? gender : user.gender,
      age: age !== undefined ? age : user.age,
      bio: bio !== "" ? bio : user.bio,
      shippingAddress: shippingAddress ? shippingAddress : user.shippingAddress,
    });

    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
        image: user.image,
        gender: user.gender,
        age: user.age,
        bio: user.bio,
        shippingAddress: user.shippingAddress,
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
