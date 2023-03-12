import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@thasup-dev/common';

import { User } from '../models/user';
import type { UserAttrs } from '../types/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('gender').not().isEmpty().withMessage('Gender is required'),
    body('age').isInt({ gt: 0 }).not().isEmpty().withMessage('Age is required')
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
      shippingAddress
    }: UserAttrs = req.body;

    let { image }: UserAttrs = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser != null) {
      throw new BadRequestError('Email already in use');
    }

    // Assign random generated image from API
    if (image == null) {
      image = `https://avatars.dicebear.com/api/micah/${name.trim()}${email.trim()}.svg?b=%23f0f0f0`;
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
      shippingAddress
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
        shippingAddress
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
