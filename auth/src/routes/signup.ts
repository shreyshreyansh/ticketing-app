import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { User } from '../models/user';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

// use express-validator as a middleware to check if email and password is valid
// if the email or password is invalid, it will return the string inside withMessage function

// a valid email should follow an actual email format through isEmail()
// a valid password should be of 4>=length<=20
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters!'),
  ],
  async (req: Request, res: Response) => {
    /**
     * STEPS:
     * 1. Check the body send by the user using express-validator
     * 2. Check if user exists with the given email address
     * 3. Hash the password
     * 4. Create a new user and store it in DB
     * 5. Send the user a JWT token as a response
     */

    // STEP 1
    // we can find the result of the validation middleware by calling the validationResult function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // this will automatically be picked by the error handler middleware
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    // STEP 2
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email in use');
      return res.send({});
    }

    // STEP 4
    const user = User.build({
      email,
      password,
    });
    await user.save();

    // Simulating STEP 5
    res.status(201).send(user);
  }
);

export { router as signupRouter };
