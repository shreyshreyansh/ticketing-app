import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { validateRequest } from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').trim().notEmpty().withMessage('Must give a password!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new NotFoundError('User not found');

    const isMatching = await Password.compare(existingUser.password, password);

    if (!isMatching) throw new BadRequestError('Wrong email or password');

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
